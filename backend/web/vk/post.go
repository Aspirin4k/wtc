package vk

type ResponsePost struct {
	Response *PostCollection `json:"response"`
	Error    *Error          `json:"error"`
}

type PostCollection struct {
	Count int     `json:"count"`
	Items []*Post `json:"items"`
}

type Post struct {
	ID          int           `json:"id"`
	Date        int           `json:"date"`
	OwnerID     int           `json:"owner_id"`
	Text        string        `json:"text"`
	Attachments []*Attachment `json:"attachments"`
	CopyHistory []*Post       `json:"copy_history"`
}

type Attachment struct {
	Type  string `json:"type"`
	Photo *Photo `json:"photo"`
}

type Photo struct {
	ID    int          `json:"id"`
	Sizes []*PhotoSize `json:"sizes"`
}

type PhotoSize struct {
	URL    string `json:"url"`
	Type   string `json:"type"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
}

type Error struct {
	ErrorCode int    `json:"error_code"`
	ErrorMsg  string `json:"error_msg"`
}
