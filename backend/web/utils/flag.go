package utils

import (
	"flag"
	"strings"
)

const (
	vkApiUrl                 = "vk_api_url"
	vkApiVersion             = "vk_api_version"
	vkApiToken               = "vk_api_token"
	springDatasourceUrl      = "spring_datasource_url"
	springDatasourceUsername = "spring_datasource_username"
	springDatasourcePassword = "spring_datasource_password"
)

var (
	flags = make(map[string]*string, 15)
)

func FlagGet(name string) string {
	value := flags[strings.ToLower(name)]
	if nil == value {
		return ""
	}

	return *value
}

func FlagInit() {
	flags[vkApiUrl] = flag.String(vkApiUrl, "", "VK Api Url")
	flags[vkApiToken] = flag.String(vkApiToken, "", "VK Api Access Token")
	flags[vkApiVersion] = flag.String(vkApiVersion, "", "VK Api Version")
	flags[springDatasourceUrl] = flag.String(springDatasourceUrl, "", "Database Url")
	flags[springDatasourceUsername] = flag.String(springDatasourceUsername, "", "Database User")
	flags[springDatasourcePassword] = flag.String(springDatasourcePassword, "", "Database Password")
}

func FlagParse() {
	flag.Parse()
}
