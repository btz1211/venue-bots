HotJot Bot - Create Job API
============

### Description
This lambda creates a hotjot bot job in disabled mode

### Test locally
- run `npm install` to install dependencies
- run `node main.js` to invoke index.js handler

### Test on AWS Console
- Go to `Lambda` Service
- select lambda with the following prefix `hotjot-bots-api-CreateJob`
- select `Create new test event`
- select `Amazon API Gateway AWS Proxy`
- replace the `body` key in test data with the following:

```
{
    "body": "{\"jobType\": \"foursquare\",\"radius\": \"1000\", \"location\": \"new york\", \"query\": \"nail salon\", \"postsPerHour\": \"120\",\"hotjotUsername\": \"HotJot\",\"hotjotPassword\": \"H0tj0t\"}"
}
```
- click on `Test` button