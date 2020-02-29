'use strict';
const aws = require('aws-sdk');

const defaultJobStatus = 'created';
const runningJobStatus = 'running';
const stoppedJobStatus = 'stopped';

module.exports = class AWSClient {
    constructor(dynamoTable, defaultRegion = 'us-east-1') {
        aws.config.update({ region: defaultRegion });
        this.lambda = new aws.Lambda();
        this.ddb = new aws.DynamoDB({ params: { TableName: dynamoTable } });
        this.secretManager = new aws.SecretsManager();
    }

    createJob(jobData, jobLambda) {
        const jobTimestamp = Date.now();
        const jobId = jobData.jobType + '-' + jobTimestamp;

        const itemParams = {
            Item: {
                jobId: { S: jobId },
                jobType: { S: jobData.jobType },
                jobTimestamp: { N: jobTimestamp.toString() },
                jobStatus: { S: defaultJobStatus},
                lambda: { S: jobLambda },
                query: { S: jobData.query },
                location: { S: jobData.location },
                radius: { N: jobData.radius.toString() },
                limit: { N: jobData.limit.toString() },
                postCount: { N: "0" },
            }
        };

        return new Promise((resolve, reject) => {
            this.ddb.putItem(itemParams, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getJob(jobId, index) {
        const params = {
            IndexName: index,
            ExpressionAttributeValues: {
                ":j": { S: jobId }
            }, 
            KeyConditionExpression: "jobId = :j", 
        }

        return new Promise((resolve, reject) => {
            this.ddb.query(params, (error, data) => {
                if (error) {
                    return reject(error);
                } else {
                    let job = {};
                    if (data.Items && data.Items.length > 0) {
                        job = data.Items[0];
                    } 
                    return resolve(job);
                }
            })
        });
    }

    getJobs(jobType, timestamp) {
        let filterByTimestamp = Number.MAX_SAFE_INTEGER.toString();
        if (timestamp) {
            filterByTimestamp = timestamp;
        }

        const keyConditions = {
            jobType: {
                "ComparisonOperator" : "EQ",
                "AttributeValueList": [ {"S": jobType} ]
            },
            jobTimestamp: {
                "ComparisonOperator" : "LT",
                "AttributeValueList": [ {"N": filterByTimestamp} ]  
            }
        }
        
        const params = {
            KeyConditions: keyConditions,
            ScanIndexForward: false,
            Limit: 5,
        }

        console.log("params: " + JSON.stringify(params));

        return new Promise((resolve, reject) => {
            this.ddb.query(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    startJob(jobId, jobType, jobTimestamp, lambdaName) {
        var params = {
            FunctionName: lambdaName,
            InvocationType: 'Event',
            Payload: JSON.stringify({ jobId: jobId })
        };

        var itemParams = {
            Key: { jobType: { S: jobType }, jobTimestamp: { N: jobTimestamp } },
            UpdateExpression: "set jobStatus = :s",
            ExpressionAttributeValues: {
                ":s": { "S": runningJobStatus }
            },
            ReturnValues: "ALL_NEW"
        };
    
        return new Promise((resolve, reject) => {
            this.lambda.invoke(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                this.ddb.updateItem(itemParams, (error, data) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(data);
                    }
                });
            });
        });
    }

    completeJob(jobType, jobTimestamp, newPostCount) {
        var itemParams = {
            Key: { jobType: { S: jobType }, jobTimestamp: { N: jobTimestamp.toString() } },
            UpdateExpression: "set postCount = :o, jobStatus = :s",
            ExpressionAttributeValues: {
                ":o": { "N": newPostCount.toString() },
                ":s": { "S": stoppedJobStatus }
            },
            ReturnValues: "ALL_NEW"
        };
    
        return new Promise((resolve, reject) => {
            this.ddb.updateItem(itemParams, (error, data) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(data);
                }
            });
        });
    }

    deleteJob(jobType, jobTimestamp) {
        const params = {
            Key: {
                'jobType': { S: jobType },
                'jobTimestamp': {N: jobTimestamp}
              }
        }
    
        return new Promise((resolve, reject) => {
            this.ddb.deleteItem(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.Item);
                }
            });
        });
    }

    getSecret(secretId) {
        const params = {
            SecretId: secretId
        };
    
        return new Promise((resolve, reject) => {
            this.secretManager.getSecretValue(params, (error, data) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(data.SecretString);
                }
            });
        });
    }
}
