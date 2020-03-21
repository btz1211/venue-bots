const AWSClient = require('./aws.js');
  
data = {
    "jobType": "google",
    "radius": 10000,
    "location": "miami",
    "query": "korean",
    "limit": "1",
}

const client = new AWSClient('venue-bots');
client.startJob('google-1584818420490', 'google', '1584818420490', 'google-bot').then(response => console.log(response));