const deleteJobLambda = require('./deleteJob.js');

// test for delete job
const event =  {
    pathParameters: {
        jobId: 'google-1583978999823'
    }
}
deleteJobLambda.handler(event, {}, (error, data) => {});