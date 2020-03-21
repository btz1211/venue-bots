const updateJobStatusLambda = require('./updateJobStatus.js');

// test for start job
const event =  {
    pathParameters: {
        jobId: 'google-1584818420490',
        action: 'start'
    }
}
updateJobStatusLambda.handler(event, {}, (error, data) => {});
