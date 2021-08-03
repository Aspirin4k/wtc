#!/bin/bash

app_directory="/home/ubuntu/app/prod"
current_release_file="${app_directory}/current_release"
blue_release="blue"
green_release="green"

current_release=$(cat "$current_release_file")
if [[ "$current_release" = "$blue_release" ]]; then
  target_release="$green_release"
else
  target_release="$blue_release"
fi

target_nginx_conf="${app_directory}/nginx/${target_release}"
ln -s "${target_nginx_conf}" /etc/nginx/conf.d
service nginx reload