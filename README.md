Venue Bots
============

### Description
This contains the serverless code for ETL bots that extracts venue data from google places api

### Project Structure
- ansible - contains all the configuration management yaml files + cloudformation scripts
- bot-backend - contains NodeJS lambda code for the API's and google bot
- bot-frontend - contains ReactJS code for a simple dashboard for managing the venue bot

NOTE: each NodeJS package contains it's own README, navigate to the packages for further instructions

### Local Environment Setup required (Mac)

- Ansible - run `brew install ansible`
- JQ - run `brew install jq`
- AWS Client - run `brew install awscli` 
- AWS SAM - run `brew tap aws/tap`, then `brew install aws-sam-cli`
- to get/create access/secret key
    - go to AWS Console
    - select `IAM` from `Services`
    - click on `Users` on the left panel then choose `Security credentials` tab on the right
    - click on `Create access key` to create a new key pair
- setup up aws credentials by making sure `~/.aws/credentials` looks like something like this:
    
```
[default]
aws_access_key_id = [YOUR ACCESS KEY]
aws_secret_access_key = [YOUR SECRET ACCESS KEY]
```
- to run the google bot, an `Google Places` API key need to be added to the `Secret Manager` in aws
    - go to AWS Console
    - select `Secret Manager`
    - click on `store a new secret`
    - select `Other type of secrets` in the pop up and the `Plaintext` tab below
    - clear out the default text within and paste your API key
    - click `next` and use `google-api-key` as the secret name and finish the creation


### Deployment
- run `./scripts/deploy-bots.bash`

### Test API on AWS Console
- first make sure to run the deployment script to deploy the latest code to AWS
- Click on `Services` and search/select `API Gateway`
- Under the left-side navigation pane, click on `venue-bots-api`
- select the resource, then the method you would like to test, clikc on `Test` with a lightning icon below it
- input the correct input data and click on `Test` button at the bottom

### API for controlling the bots
- Get Jobs
    - method: GET
    - url: `/jobs`

- Create Job 
    - method: POST
    - url: `/job`
    - sample body
```
{
    "jobType": "google",
    "radius": "10000",
    "location": "new york",
    "query": "korean",
    "limit": 10
}
```

- Delete job
    - method: DELETE
    - url: `/job/{jobId}`

- Start job
    - method: PUT
    - url: `/job/{jobId}/start`

- Stop job
    - method: PUT
    - url: `/job/{jobId}/stop`
