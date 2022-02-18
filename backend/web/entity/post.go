package entity

const (
	TitleLength = 90
)

type Post struct {
	ID            int      `json:"id"`
	CommunityID   int      `json:"communityId"`
	Title         string   `json:"title"`
	Content       string   `json:"content"`
	DatePublished int      `json:"datePublished"`
	Photos        []*Photo `json:"photos"`
}
