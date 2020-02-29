const AWSClient = require('aws-client');

const botMap = {
    google: {
        id: 'google-bot',
    }
}

const dynamoTable = "venue-bots"

class ValidationError extends Error {};

exports.handler = async function (event, context, callback) {
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        },
        body: {}
    };

    try {
        const jobData = JSON.parse(event.body);
        validateRequest(jobData);
        
        const awsClient = new AWSClient(dynamoTable);

        // persist job info in dynamo
        console.log('[INFO] - persisting job data in dynamo');
        await awsClient.createJob(jobData, botMap[jobData.jobType].id);

        console.log(`[INFO] - successfully created job`);
        response.body.message = "successfully created job";
    } catch (error) {
        console.error(error);

        if (error instanceof ValidationError) {
            response.statusCode = 400;
            response.body.message = error.message;

        } else {
            response.statusCode = 500;
            response.body.message = `failed to create job due to: [${error}]`;
        }
    } finally {
        response.body = JSON.stringify(response.body);
        callback(null, response);
    }
}

function validateRequest(data) {
    if(!botMap[data.jobType]) {
        throw new ValidationError("400 please provide provide a job type, pick one of the following: [google]");
    }

    if (!data.query ||!data.location || !data.radius || !data.limit) {
        throw new ValidationError("400 please provide the following data in body: " +
            "[query, location, radius, limit]");
    }

    const radiusInt = parseInt(data.radius, 10);
    if (!radiusInt || radiusInt < 1 || radiusInt > 10000) {
        throw new ValidationError("400 please provide a value for between 1-10000 for radius in body");
    }

    const limit = parseInt(data.limit, 10)
    if (!limit || limit < 1 || limit > 100) {
        throw new ValidationError("400 please provide a value for field [limit] between 1-100 for limit");
    }
}