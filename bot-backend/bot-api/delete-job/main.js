const deleteJobLambda = require('./deleteJob.js');

// test for delete job
const event =  {
    pathParameters: {
        jobId: 'google-1581787662488'
    }
}
deleteJobLambda.handler(event, {}, (error, data) => {});