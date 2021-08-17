#!/bin/bash
# Deploy server

tar -zcvf /home/ubuntu/app/prod/deploy.tar.gz -C /home/ubuntu/app/prod deploy
tar -zcvf /home/ubuntu/app/prod/f-deploy.tar.gz -C /home/ubuntu/app/prod f-deploy

cd /home/ubuntu/app/ansible
ansible-playbook deploy_run.yml -i hosts