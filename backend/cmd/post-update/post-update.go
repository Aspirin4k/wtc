package main

import (
	"fmt"

	"whentheycry.ru/m/v2/web"
	"whentheycry.ru/m/v2/web/utils"
)

func main() {
	fmt.Println("Running post-updater version: " + web.BuildVersion)

	utils.FlagInit()
	utils.FlagParse()

	locator := web.NewServiceLocator()

	db, err := locator.GetDB()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	synchronizer, err := locator.GetVKSynchronizer()
	if err != nil {
		panic(err)
	}

	err = synchronizer.SyncAllPosts()
	if err != nil {
		panic(err)
	}
}
