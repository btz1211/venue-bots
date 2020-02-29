const AWSClient = require('./aws.js');
  
data = {
    "jobType": "google",
    "radius": 10000,
    "location": "miami",
    "query": "korean",
    "limit": "1",
}

const client = new AWSClient('venue-bots');
// client.getJobs('google-bot', '1574348779508').then(data => console.log(data)).catch(error => console.log(error));
client.createJob(data, 'google-bot');
// client.getJob('google-bot', '1580656207328')