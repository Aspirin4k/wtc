package vk

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

type Client struct {
	httpClient *http.Client

	url     string
	token   string
	version string
}

func New(url string, token string, version string) *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
			Transport: &http.Transport{
				MaxIdleConns:    100,
				IdleConnTimeout: 15 * time.Second,
			},
		},
		token:   token,
		version: version,
		url:     url,
	}
}

func (c *Client) GetLastPosts(communityID int, offset int, limit int) (*ResponsePost, error) {
	request, err := http.NewRequest(http.MethodGet, c.url+"/method/wall.get", nil)
	if err != nil {
		return nil, err
	}

	query := request.URL.Query()
	query.Add("filter", PostTypeOwner)
	query.Add("owner_id", strconv.Itoa(-communityID))
	query.Add("count", strconv.Itoa(limit))
	query.Add("offset", strconv.Itoa(offset))
	query.Add("access_token", c.token)
	query.Add("v", c.version)
	request.URL.RawQuery = query.Encode()

	response, err := c.httpClient.Do(request)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	responsePosts := new(ResponsePost)
	err = json.NewDecoder(response.Body).Decode(responsePosts)
	if err != nil {
		return nil, err
	}

	if responsePosts.Error != nil {
		return nil, fmt.Errorf("error while getting posts from vk: %s", responsePosts.Error.ErrorMsg)
	}

	return responsePosts, nil
}
