Venue Bots - Create Job API
============

### Description
This lambda creates a bot job 

### Test locally
- run `npm install` to install dependencies
- run `node main.js` to invoke index.js handler

### Test on AWS Console
- Go to `Lambda` Service
- select lambda that looks like `CreateJob`
- select `Create new test event`
- select `Amazon API Gateway AWS Proxy`
- replace the `body` key in test data with the following:

```
{
    "body": "{\"jobType\": \"google\",\"radius\": \"1000\", \"location\": \"new york\", \"query\": \"nail salon\", \"limit\": \"10\"}"
}
```
- click on `Test` button