const getJobsLambda = require('./getJobs.js');

// test for getJobs lambda
const event =  {
    pathParameters: {
        botType: 'google',
    }
}

getJobsLambda.handler(event, {}, (error, result) => {
    if(error) {
        console.error(error);
    } else {
        console.log(JSON.parse(result.body));
    }
});