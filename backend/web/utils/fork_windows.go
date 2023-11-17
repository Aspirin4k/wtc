package utils

import (
	"os/exec"
)

func Fork(command string, args ...string) {
	cmd := exec.Command("cmd.exe", "/C", "start", command)

	cmd.Run()
}
