const AWSClient = require('aws-client');

class ValidationError extends Error {};

exports.handler = async function (event, context, callback) {
    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE'
        },
        body: {}
    };

    try {
        validateRequest(event.pathParameters);
        const awsClient = new AWSClient(); 
        
        const jobId = event.pathParameters.jobId;
        const job = await awsClient.getJob(jobId);

        if (job) {
            console.log(`[INFO] - deleting job:`);
            console.log(job);

            await awsClient.deleteJob(job.jobType.S, job.jobTimestamp.N);

            const message = `succesfully deleted job: [${jobId}]`;
            console.log(`[INFO] - ${message}`);
            response.body.message = message;
        } else {
            const errorMessage = `job: [${jobId}] does not exist in database`;
            console.log(`[INFO] - ${errorMessage}`)

            response.statusCode = 404;
            response.body.message = errorMessage;
        }
    } catch (error) {
        console.error(error);

        if (error instanceof ValidationError) {
            response.statusCode = 400;
            response.body.message = error.message;
        } else {
            response.statusCode = 500;
            response.body.message = ` failed to delete job due to: [${error}]`;
        }
    } finally {
        response.body = JSON.stringify(response.body);
        callback(null, response);
    }
}

function validateRequest(data) {
    if (!data.jobId) {
        throw new ValidationError("400 please provide the jobId you would like to delete");
    }
}