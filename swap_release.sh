#!/bin/bash

app_directory="/home/ubuntu/app"
prod_directory="${app_directory}/prod"
env_directory="${app_directory}/env"
current_release_file="${prod_directory}/current_release"
blue_release="blue"
green_release="green"

current_release=$(cat "$current_release_file")
if [[ "$current_release" = "$blue_release" ]]; then
  target_release="$green_release"
else
  target_release="$blue_release"
fi

# set reverse proxy to handle prod traffic on new release
target_nginx_conf="${prod_directory}/nginx/${target_release}"
ln -sf "${target_nginx_conf}" /etc/nginx/conf.d/release

# set prod env variables for new release
target_env="${env_directory}/.env_${target_release}"
ln -sf "${env_directory}/.env" "${target_env}"
systemctl daemon-reload
systemctl restart "${target_release}-wtc.service"
# expect server to start in 15 seconds
sleep 15

# apply reverse proxy changes
service nginx reload

# set current release to new release
echo "$target_release" > "$current_release_file"

# move previous release to test environment
DEPLOY_RELEASE_VERSION="${target_release}" bash /home/ubuntu/app/prod/post_deploy.sh
current_env="${env_directory}/.env_${current_release}"
ln -sf "${env_directory}/.env_test" "${current_env}"
systemctl daemon-reload
systemctl restart "${current_release}-wtc.service"