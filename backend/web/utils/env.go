package utils

import (
	"os"
	"strconv"
)

func GetEnv(name string, defaultValue string) string {
	result := FlagGet(name)

	if "" == result {
		result = os.Getenv(name)
	}

	if "" == result {
		result = defaultValue
	}

	return result
}

func GetIntEnv(name string, defaultValue int) int {
	result := GetEnv(name, "")

	if "" == result {
		return defaultValue
	}

	resultInt, err := strconv.Atoi(result)
	if err != nil {
		return defaultValue
	}

	return resultInt
}
