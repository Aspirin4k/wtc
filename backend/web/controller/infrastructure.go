package controller

import (
	"net/http"
	"os"
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
	if isWindows {
		swapReleaseScript += ".bat"
		utils.Fork(swapReleaseScript)
	} else {
		swapReleaseScript += ".sh"
		utils.Fork("/bin/bash", swapReleaseScript)
	}

	os.Exit(1)
	w.WriteHeader(http.StatusOK)
}
