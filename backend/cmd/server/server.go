package main

import (
	"database/sql"
	"net/http"
	"time"

	"whentheycry.ru/m/v2/web/controller"
	"whentheycry.ru/m/v2/web/middleware"
	"whentheycry.ru/m/v2/web/storage"
	"whentheycry.ru/m/v2/web/utils"
)

func main() {
	dbUrl := utils.GetEnv("MYSQL_DATABASE_URL", "tcp(127.0.0.1:3306)/posts")
	dbUser := utils.GetEnv("MYSQL_DATABASE_USER", "root")
	dbPassword := utils.GetEnv("MYSQL_DATABASE_PASSWORD", "root")
	db, err := sql.Open("mysql", dbUser+":"+dbPassword+"@"+dbUrl)
	if err != nil {
		panic(err)
	}

	db.SetConnMaxLifetime(time.Minute)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	photoStorage := storage.NewPhotoStorage(db)
	postStorage := storage.NewPostStorage(db, photoStorage)
	postController := controller.NewPostController(postStorage)

	srv := &http.Server{
		ReadTimeout:       1 * time.Second,
		WriteTimeout:      5 * time.Second,
		IdleTimeout:       30 * time.Second,
		ReadHeaderTimeout: 2 * time.Second,
		Addr:              ":3001",
		Handler:           middleware.HeadersMiddleware(postController),
	}
	srv.ListenAndServe()
}
