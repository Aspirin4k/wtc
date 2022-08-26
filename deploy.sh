#!/bin/bash
# Runner

mkdir -p prod/deploy
mkdir -p prod/f-deploy

mv backend/target/* prod/deploy
cp -rp frontend/dist/* prod/f-deploy
rm -rf frontend/dist

rm -rf backend/target

echo "Packing backend"
tar -zcvf prod/deploy.tar.gz -C prod deploy > /dev/null
echo "Packing frontend"
tar -zcvf prod/f-deploy.tar.gz -C prod f-deploy > /dev/null

echo "Copying scripts"
cp post_deploy_bg.sh prod/post_deploy_bg.sh
cp swap_release.sh prod/swap_release.sh
cp notification.sh prod/notification.sh

echo "Deploying"
ansible-playbook ~/ansible/deploy_run.yml -i ~/ansible/hosts --extra-vars "local_working_directory=$(pwd)"
exit $?