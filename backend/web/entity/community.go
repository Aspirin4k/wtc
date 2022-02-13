package entity

type Community struct {
	ID    int    `json:"id"`
	Posts []Post `json:"posts"`
}
