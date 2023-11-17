package controller

import (
	"fmt"
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

	var output []byte
	var err error
	isWindows := runtime.GOOS == "windows"
	if isWindows {
		swapReleaseScript += ".bat"
		swapReleaseScript = strings.ReplaceAll(swapReleaseScript, "/", "\\")
		output, err = exec.Command(swapReleaseScript).Output()
	} else {
		swapReleaseScript += ".sh"
		output, err = exec.Command("/bin/bash", swapReleaseScript).Output()
	}

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{\"error\":\"" + err.Error() + "\"}"))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{\"result\":\"" + string(output) + "\"}"))
}
