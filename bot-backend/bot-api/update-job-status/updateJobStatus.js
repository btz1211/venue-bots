const AWSClient = require('aws-client');

const RUNNING_STATUS = 'running';
const START_ACTION = 'start';

class ValidationError extends Error {};

exports.handler = async function (event, context, callback) {
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT'
        },
        body: {}
    };

    try {
        validateRequest(event.pathParameters);

        const awsClient = new AWSClient();

        const jobId = event.pathParameters.jobId;
        const action = event.pathParameters.action;
        const job = await awsClient.getJob(jobId);

        if (job) {
            console.log(`[INFO] - updating job:[${jobId}] with action: [${action}]`);
            console.log(job);

            let message = '';
        
            if (action === START_ACTION) {
                if (job.jobStatus.S === RUNNING_STATUS) {
                    message = `job: ${jobId} is already running`;
                } else {
                    await awsClient.startJob(jobId, job.jobType.S, job.jobTimestamp.N, job.lambda.S);
                    message = `succesfully set job: [${jobId}] to action: [${action}]`;
                }
            } else {
                throw new ValidationError(`invalid job action: [${action}]`);
            }

            console.log(`[INFO] - ${message}`);
            response.body.message = message;
        } else {
            const message = `job: [${jobId}] does not exist in database`;
            console.log(`[INFO] - ${message}`)

            response.statusCode = 404;
            response.body.message = message;
        }
    } catch (error) {
        console.error(error);

        if (error instanceof ValidationError) {
            response.statusCode = 400;
            response.body.message = error.message;

        } else {
            response.statusCode = 500;
            response.body.message = ` failed to update job status due to: [${error}]`;
        }
    } finally {
        response.body = JSON.stringify(response.body);
        callback(null, response);
    }
}

function validateRequest(data) {
    if (!data.jobId || !data.action) {
        throw new ValidationError("400 please provide the jobId you would like to start, " +
            "and the action [start, stop] you would like execute");
    }

    if (['start', 'stop'].indexOf(data.action) < 0) {
        throw new ValidationError("400 please provide a valid action [start, stop]");
    }
}
