Venue Bot - Update Job Status API
============

### Description
This lambda starts or stops a bot job

### Test locally
- run `npm install` to install dependencies
- run `node main.js` to invoke index.js handler

### Test on AWS Console
- Go to `Lambda` Service
- select lambda that looks like `UpdateJobStatus`
- select `Create new test event`
- select `Amazon API Gateway AWS Proxy`
- replace the `pathParameters` key in test data with the following:

```
{
    "pathParameters": {
        "jobId": "[VALID JOB ID]"
        "action": "[start]"
    }
}
```

- click on `Test` button