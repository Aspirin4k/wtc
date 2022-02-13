package entity

type Photo struct {
	ID        int    `json:"id"`
	PostID    int    `json:"-"`
	UrlLarge  string `json:"urlLarge"`
	UrlMedium string `json:"urlMedium"`
	UrlSmall  string `json:"urlSmall"`
}
