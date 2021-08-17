#!/bin/bash
# Simple server

deploy_release=${DEPLOY_RELEASE_VERSION:-deploy}
app_directory="/home/ubuntu/app/prod"
current_release_file="${app_directory}/current_release"
deploy_directory="${app_directory}/${deploy_release}"
deploy_directory_f="${app_directory}/f-${deploy_release}"
blue_release="blue"

if [[ ! -f "$current_release_file" ]]; then
  echo "$blue_release" > "$current_release_file"
fi

current_release=$(cat "$current_release_file")

target_directory="${app_directory}/${current_release}"
target_directory_f="${app_directory}/f-${current_release}"
target_service="${current_release}-wtc.service"
target_service_f="${current_release}-wtc-f.service"

# stop current release
systemctl stop "$target_service"
systemctl stop "$target_service_f"
rm -rf "${target_directory}/*"
rm -rf "${target_directory_f}/*"

# start new release
cp -R "${deploy_directory}/." "${target_directory}"
cp -R "${deploy_directory_f}/." "${target_directory_f}"
systemctl start "$target_service"
systemctl start "$target_service_f"
