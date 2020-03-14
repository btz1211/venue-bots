const AWSClient = require('aws-client');

exports.handler = async function (event, context, callback) {
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
        },
        body: {}
    };

    try {
        const awsClient = new AWSClient();
        const botType = event.pathParameters.botType;

        let timestamp;
        if (event.queryStringParameters) {
            timestamp = event.queryStringParameters.timestamp;
        }

        if (botType) {
            const jobs = await awsClient.getJobs(botType, timestamp);
            response.statusCode = 200;
            response.body = jobs;
        } else {
            response.statusCode = 400;
            response.body.message = `bad request, must provide path param [botType]`;
        }
       
    } catch (error) {
        console.error(error);
        
        response.statusCode = 500;
        response.body.message = `failed to get jobs due to: [${error}]`
    } finally {
        response.body = JSON.stringify(response.body);
        callback(null, response);
    }
}