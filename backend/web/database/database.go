package database

import (
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"whentheycry.ru/m/v2/web/utils"
)

func NewDB() (*sql.DB, error) {
	dbUrl := utils.GetEnv("MYSQL_DATABASE_URL", "tcp(127.0.0.1:3306)/posts")
	dbUser := utils.GetEnv("MYSQL_DATABASE_USER", "root")
	dbPassword := utils.GetEnv("MYSQL_DATABASE_PASSWORD", "root")
	db, err := sql.Open("mysql", dbUser+":"+dbPassword+"@"+dbUrl)
	if err != nil {
		return nil, err
	}

	db.SetConnMaxLifetime(time.Minute)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}
