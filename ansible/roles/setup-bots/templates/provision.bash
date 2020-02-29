#!/usr/bin/env bash

CWD=`pwd`

# =========================provision the bots stack=========================
CHECK_RESULT=`aws cloudformation describe-stacks --stack-name {{ cloudformation_stack_name }} || true`
BOTS_STACK_IN_GOOD_STATUS=1

if [[ $CHECK_RESULT ]]; then
  echo "venue bots stack exists already, updating it"

  UPDATE_RESULT=`aws cloudformation update-stack --stack-name {{ cloudformation_stack_name }} --template-body file://config/{{ lambda_cloudformation_script }} --parameters file://config/{{ cloudformation_parameters }} --capabilities CAPABILITY_IAM || true`

  # wait only if there is an actual update
  if [[ $UPDATE_RESULT ]]; then
    aws cloudformation wait stack-update-complete --stack-name {{ cloudformation_stack_name }}
    STATUS="$(aws cloudformation describe-stack-events --stack-name {{ cloudformation_stack_name }} --max-items 1 |jq -r '.StackEvents[0].ResourceStatus')"

    if [[ "$STATUS" = "UPDATE_COMPLETE" ]]; then
      BOTS_STACK_IN_GOOD_STATUS=0
    else
      echo "stack is in bad status: $STATUS"
    fi
  else
    echo "no updates necessary, moving on to provisioning lambda + API infrastructure"
    BOTS_STACK_IN_GOOD_STATUS=0
  fi
else
  echo "venue bots stack does not exist, creating it"

  aws cloudformation create-stack --stack-name {{ cloudformation_stack_name }} --template-body file://config/{{ lambda_cloudformation_script }} --parameters file://config/{{ cloudformation_parameters }} --capabilities CAPABILITY_IAM
  aws cloudformation wait stack-create-complete --stack-name {{ cloudformation_stack_name }}
  STATUS="$(aws cloudformation describe-stack-events --stack-name {{ cloudformation_stack_name }} --max-items 1 |jq -r '.StackEvents[0].ResourceStatus')"

  if [[ "$STATUS" = "CREATE_COMPLETE" ]]; then
    BOTS_STACK_IN_GOOD_STATUS=0
  fi
fi

if [[ $BOTS_STACK_IN_GOOD_STATUS == 0 ]]; then
  # =========================clean up s3 bucket before provisioning assets==========================
  aws s3 rm s3://{{ lambda_bucket_name }} --recursive

  # =========================upload google lambda code to s3 bucket=========================
  cd $CWD
  cd {{ google_bot_source_dir }}
  zip -r {{ google_bot_lambda_zip }} *
  aws s3 cp {{ google_bot_lambda_zip }} s3://{{ lambda_bucket_name }}/{{ google_bot_lambda_zip }}
  aws lambda update-function-code --function-name {{ google_lambda_name }} --s3-bucket {{ lambda_bucket_name }} --s3-key {{ google_bot_lambda_zip }} --publish

  # =========================provision the hotjot bots api stack=========================
  cd $CWD
  sam package --template-file config/{{ api_cloudformation_script }} --output-template-file config/{{ api_cloudformation_script }} --s3-bucket {{ lambda_bucket_name }}
  sam deploy --template-file config/{{ api_cloudformation_script }} --stack-name hotjot-bots-api --capabilities CAPABILITY_IAM
fi