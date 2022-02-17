package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"

	"whentheycry.ru/m/v2/web/entity"

	_ "github.com/go-sql-driver/mysql"

	"whentheycry.ru/m/v2/web/storage"
)

const (
	pageSize = 15
)

var (
	pageIDregexp = regexp.MustCompile("^/post/(\\d+)$")
)

type GetPostsResponse struct {
	Total   int            `json:"total"`
	HasMore bool           `json:"has_more"`
	Items   []*entity.Post `json:"items"`
}

type PostController struct {
	postStorage *storage.Post
}

func NewPostController(postStorage *storage.Post) *PostController {
	return &PostController{
		postStorage: postStorage,
	}
}

func (c *PostController) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	pageIDGroup := pageIDregexp.FindStringSubmatch(r.URL.Path)

	if len(pageIDGroup) < 2 {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	pageIDString := pageIDGroup[1]
	pageID, err := strconv.Atoi(pageIDString)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if pageID <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var response GetPostsResponse
	total, err := c.postStorage.GetPostsCount()
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response.Total = total
	response.HasMore = pageSize*pageID < total

	var posts []*entity.Post
	if total > 0 {
		posts, err = c.postStorage.GetPosts(pageSize*(pageID-1), pageSize)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		posts = make([]*entity.Post, 0)
	}
	response.Items = posts

	responseJson, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(responseJson)
}
