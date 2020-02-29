#!/bin/bash

CWD=`pwd`

cd ${CWD}/ansible
ansible-playbook setup-bots.yml

cd ${CWD}/dist/venue-bots
bash provision.bash
