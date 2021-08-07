#!/bin/bash
# Blue-green deployment implementation

deploy_release=${DEPLOY_RELEASE_VERSION:-deploy}
app_directory="/home/ubuntu/app/prod"
current_release_file="${app_directory}/current_release"
deploy_directory="${app_directory}/${deploy_release}"
deploy_directory_f="${app_directory}/f-${deploy_release}"
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
target_directory_f="${app_directory}/f-${test_release}"
target_service="${test_release}-wtc.service"
target_service_f="${test_release}-wtc-f.service"

# stop previous release
systemctl stop "$target_service"
systemctl stop "$target_service_f"
rm -rf "${target_directory}/*"
rm -rf "${target_directory_f}/*"

# start new release
cp -R "${deploy_directory}/." "${target_directory}"
cp -R "${deploy_directory_f}/." "${target_directory_f}"
systemctl start "$target_service"
systemctl start "$target_service_f"