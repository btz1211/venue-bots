const createJobLambda = require('./createJob.js');

data = {
    "jobType": "google",
    "query": "korean",
    "limit": "10",
    "location": "new york city",
    "radius": 1000,
}

const event =  {
    body: JSON.stringify(data)
}
createJobLambda.handler(event, {}, (error, data) => {});