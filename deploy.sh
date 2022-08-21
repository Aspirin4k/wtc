#!/bin/bash
# Runner

mkdir -p prod/deploy
mkdir -p prod/f-deploy

mv backend/target/* prod/deploy
mv frontend/dist prod/f-deploy

rm -rf backend/target

tar -zcvf prod/deploy.tar.gz -C prod deploy
tar -zcvf prod/f-deploy.tar.gz -C prod f-deploy

#cd /home/ubuntu/app/ansible
#ansible-playbook deploy_run.yml -i hosts