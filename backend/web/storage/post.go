package storage

import (
	"database/sql"
	"strings"

	"whentheycry.ru/m/v2/web/entity"
)

type Post struct {
	db *sql.DB

	photo *Photo
}

func NewPostStorage(db *sql.DB, photo *Photo) *Post {
	return &Post{
		db: db,

		photo: photo,
	}
}

func (st *Post) GetPosts(offset int, limit int) ([]*entity.Post, error) {
	rows, err := st.db.Query(`
SELECT post_id, community_id, title, content, date_published
FROM posts.posts
ORDER BY date_published DESC
LIMIT ?
OFFSET ?`, limit, offset)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	results := make([]*entity.Post, 0, limit)
	for rows.Next() {
		var post entity.Post
		err := rows.Scan(&post.ID, &post.CommunityID, &post.Title, &post.Content, &post.DatePublished)
		if err != nil {
			return nil, err
		}
		post.Photos = make([]*entity.Photo, 0)

		results = append(results, &post)
	}

	err = st.photo.FillPosts(results)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (st *Post) GetPostsCount() (int, error) {
	row := st.db.QueryRow("SELECT COUNT(post_id) FROM posts.posts")

	count := 0
	err := row.Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (st *Post) GetLastPost(communityId int) (*entity.Post, error) {
	row := st.db.QueryRow(`
SELECT post_id, title, content, date_published 
FROM posts.posts 
WHERE community_id = ? 
ORDER BY date_published DESC`, communityId)

	var result entity.Post
	err := row.Scan(&result.ID, &result.Title, &result.Content, &result.DatePublished)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		} else {
			return nil, err
		}
	}

	return &result, nil
}

func (st *Post) Save(posts []*entity.Post) error {
	if len(posts) == 0 {
		return nil
	}

	transaction, err := st.db.Begin()
	if err != nil {
		return err
	}

	query := "INSERT INTO posts.posts(post_id, community_id, title, content, date_published) VALUES"
	sqlStrs := make([]string, 0, len(posts))
	values := make([]interface{}, 0, 5*len(posts))
	for _, post := range posts {
		sqlStrs = append(sqlStrs, "(?, ?, ?, ?, ?)")
		values = append(values, post.ID, post.CommunityID, post.Title, post.Content, post.DatePublished)

		err := st.photo.SaveTr(transaction, post.Photos)
		if err != nil {
			_ = transaction.Rollback()
			return err
		}
	}

	query += strings.Join(sqlStrs, ",")
	_, err = transaction.Exec(query, values...)
	if err != nil {
		_ = transaction.Rollback()
	} else {
		_ = transaction.Commit()
	}

	return err
}
