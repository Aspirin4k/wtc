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

func (st *Photo) FillPosts(posts []*entity.Post) error {
	if len(posts) == 0 {
		return nil
	}

	postsMap := make(map[int]*entity.Post, len(posts))
	postsIDs := make([]interface{}, 0, len(posts))
	for _, post := range posts {
		postsMap[post.ID] = post
		postsIDs = append(postsIDs, post.ID)

		post.Photos = make([]*entity.Photo, 0, 5)
	}

	stmt, err := st.db.Prepare(`
SELECT photo_id, post_id, is_horizontal, url_large, url_medium, url_small 
FROM posts.photos 
WHERE post_id IN (?` + strings.Repeat(",?", len(posts)-1) + ")")
	if err != nil {
		return err
	}

	rows, err := stmt.Query(postsIDs...)
	if err != nil {
		return err
	}

	for rows.Next() {
		var photo entity.Photo
		err := rows.Scan(&photo.ID, &photo.PostID, &photo.IsHorizontal, &photo.UrlLarge, &photo.UrlMedium, &photo.UrlSmall)
		if err != nil {
			return err
		}

		postsMap[photo.PostID].Photos = append(postsMap[photo.PostID].Photos, &photo)
	}

	return nil
}

func (st *Photo) SaveTr(transaction *sql.Tx, photos []*entity.Photo) error {
	if len(photos) == 0 {
		return nil
	}

	query := "INSERT INTO posts.photos(photo_id, post_id, is_horizontal, url_large, url_medium, url_small) VALUES"
	sqlStrs := make([]string, 0, len(photos))
	values := make([]interface{}, 0, 5*len(photos))
	for _, photo := range photos {
		sqlStrs = append(sqlStrs, "(?, ?, ?, ?, ?, ?)")
		values = append(values, photo.ID, photo.PostID, photo.IsHorizontal, photo.UrlLarge, photo.UrlMedium, photo.UrlSmall)
	}

	query += strings.Join(sqlStrs, ",")
	_, err := transaction.Exec(query, values...)
	return err
}

func (st *Photo) Clear(tr *sql.Tx) error {
	var err error
	if tr == nil {
		_, err = st.db.Exec("TRUNCATE posts.photos")
	} else {
		_, err = tr.Exec("TRUNCATE posts.photos")
	}
	return err
}
