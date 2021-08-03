#!/bin/bash

deploy_release=${DEPLOY_RELEASE_VERSION:-deploy}
app_directory="/home/ubuntu/app/prod"
current_release_file="${app_directory}/current_release"
deploy_directory="${app_directory}/${deploy_release}"
blue_release="blue"
green_release="green"

if [[ ! -f "$current_release_file" ]]; then
  echo "$blue_release" > "$current_release_file"
fi

current_release=$(cat "$current_release_file")
if [[ "$current_release" = "$blue_release" ]]; then
  test_release="$green_release"
else
  test_release="$blue_release"
fi

target_directory="${app_directory}/${test_release}"
target_service="${test_release}-wtc.service"

# stop previous release
systemctl stop "$target_service"
rm -rf "${target_directory}/*"

# start new release
cp -R "${deploy_directory}/." "${target_directory}"
export $(cat "${app_directory}/.env" | xargs)
systemctl start "$target_service"