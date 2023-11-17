package controller

import (
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"whentheycry.ru/m/v2/web/utils"
)

type InfrastructureController struct {
}

func NewInfrastructureController() *InfrastructureController {
	return &InfrastructureController{}
}

func (c *InfrastructureController) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	swapReleaseScript := utils.GetEnv("SWAP_RELEASE_SCRIPT_PATH", "../swap_release")
	if strings.HasPrefix(swapReleaseScript, ".") {
		ex, _ := os.Executable()
		swapReleaseScript = filepath.Dir(ex) + "/" + swapReleaseScript
	}

	isWindows := runtime.GOOS == "windows"
	var command *exec.Cmd
	if isWindows {
		swapReleaseScript += ".bat"
		swapReleaseScript = strings.ReplaceAll(swapReleaseScript, "/", "\\")
		command = exec.Command(swapReleaseScript)
	} else {
		swapReleaseScript += ".sh"
		command = exec.Command("/bin/bash", swapReleaseScript)
	}

	command.Start()
	w.WriteHeader(http.StatusOK)
}
