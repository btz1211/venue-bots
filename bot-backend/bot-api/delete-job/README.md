Venue Bot - Delete Job API
============

### Description
This lambda deletes bot job

### Test locally
- run `npm install` to install dependencies
- run `node main.js` to invoke index.js handler

### Test on AWS Console
- Go to `Lambda` Service
- select lambda with that looks like `DeleteJob`
- select `Create new test event`
- select `Amazon API Gateway AWS Proxy`
- replace the `pathParameters` key in test data with the following:

```
{
    "pathParameters": {
        "jobId": "[VALID JOB ID]"
    }
}
```

- click on `Test` button