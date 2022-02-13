package storage

import (
	"database/sql"
	"strings"

	"whentheycry.ru/m/v2/web/entity"
)

type Photo struct {
	db *sql.DB
}

func NewPhotoStorage(db *sql.DB) *Photo {
	return &Photo{
		db: db,
	}
}

func (st *Photo) SaveTr(transaction *sql.Tx, photos []*entity.Photo) error {
	if len(photos) == 0 {
		return nil
	}

	query := "INSERT INTO posts.photos(photo_id, post_id, url_large, url_medium, url_small) VALUES"
	sqlStrs := make([]string, 0, len(photos))
	values := make([]interface{}, 0, 5*len(photos))
	for _, photo := range photos {
		sqlStrs = append(sqlStrs, "(?, ?, ?, ?, ?)")
		values = append(values, photo.ID, photo.PostID, photo.UrlLarge, photo.UrlMedium, photo.UrlSmall)
	}

	query += strings.Join(sqlStrs, ",")
	_, err := transaction.Exec(query, values...)
	return err
}
