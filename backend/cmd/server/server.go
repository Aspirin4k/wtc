package main

import (
	"net/http"
	"time"

	"whentheycry.ru/m/v2/web"
	"whentheycry.ru/m/v2/web/controller"
	"whentheycry.ru/m/v2/web/middleware"
	"whentheycry.ru/m/v2/web/middleware/authorization"
	"whentheycry.ru/m/v2/web/utils"
)

func main() {
	utils.FlagInit()
	utils.FlagParse()

	locator := web.NewServiceLocator()

	db, err := locator.GetDB()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	postController, err := locator.GetPostController()
	if err != nil {
		panic(err)
	}

	serverPort := utils.GetEnv("SERVER_PORT", "3001")

	mux := http.NewServeMux()
	mux.Handle("/post/", postController)
	mux.Handle(
		"/internal/infra/release",
		authorization.AuthorizationMiddleware(
			authorization.DeveloperAuthorizationMiddleware(
				controller.NewInfrastructureController(),
				locator.GetXsollaClient(),
			),
		),
	)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNotFound) })

	srv := &http.Server{
		ReadTimeout:       1 * time.Second,
		WriteTimeout:      5 * time.Second,
		IdleTimeout:       30 * time.Second,
		ReadHeaderTimeout: 2 * time.Second,
		Addr:              ":" + serverPort,
		Handler:           middleware.HeadersMiddleware(mux),
	}
	srv.ListenAndServe()
}
