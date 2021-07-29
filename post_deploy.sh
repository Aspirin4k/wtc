#!/bin/bash

app_directory="/home/ubuntu/app/prod"
current_release_file="${app_directory}/current_release"
deploy_directory="${app_directory}/deploy"
blue_release="blue"
green_release="green"
binary_name="wtc-backend-1.0.jar"

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

pkill -f "$test_release"
rm -rf "${target_directory}/*"
cp -R "${deploy_directory}/." "${target_directory}"

if [[ "$target_release" = "$blue_release" ]]; then
  server_port="8080"
else
  server_port="8081"
fi

export $(cat "${app_directory}/.env" | xargs)
exec -a "$target_release" java -jar "${target_directory}/${binary_name}" --server_port="$server_port"