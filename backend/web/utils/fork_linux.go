package utils

import (
	"os/exec"
	"syscall"
)

func Fork(command string, args ...string) {
	cmd := exec.Command(command, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		Setpgid: true,
		Pgid:    0,
	}

	cmd.Start()
}
