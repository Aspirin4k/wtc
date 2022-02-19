package storage

import "database/sql"

type Community struct {
	db *sql.DB
}

func NewCommunityStorage(db *sql.DB) *Community {
	return &Community{
		db: db,
	}
}

func (st *Community) GetCommunities(tr *sql.Tx) ([]int, error) {
	var err error
	var rows *sql.Rows
	if tr == nil {
		rows, err = st.db.Query("SELECT community_id FROM posts.communities")
	} else {
		rows, err = tr.Query("SELECT community_id FROM posts.communities")
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]int, 0, 100)
	for rows.Next() {
		var communityId int
		err = rows.Scan(&communityId)
		if err != nil {
			return nil, err
		}

		result = append(result, communityId)
	}
	return result, nil
}
