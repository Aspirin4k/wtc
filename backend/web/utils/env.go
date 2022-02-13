package utils

import "os"

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
