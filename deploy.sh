#!/bin/bash
# Runner

mkdir -p prod/deploy
mkdir -p prod/f-deploy

mv backend/target/* prod/deploy
mv frontend/dist prod/f-deploy

rm -rf backend/target

echo "Packing backend"
tar -zcvf prod/deploy.tar.gz -C prod deploy > /dev/null
echo "Packing frontend"
tar -zcvf prod/f-deploy.tar.gz -C prod f-deploy > /dev/null

echo "Deploying"
ansible-playbook ~/ansible/deploy_run.yml -i ~/ansible/hosts
exit $?