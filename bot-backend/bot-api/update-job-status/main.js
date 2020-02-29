const updateJobStatusLambda = require('./updateJobStatus.js');

// test for start job
const event =  {
    pathParameters: {
        jobId: 'google-1583005305473',
        action: 'start'
    }
}
updateJobStatusLambda.handler(event, {}, (error, data) => {});