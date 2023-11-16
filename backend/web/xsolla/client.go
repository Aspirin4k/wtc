package xsolla

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type Client struct {
	httpClient *http.Client

	url                string
	clientId           int
	clientSecret       string
	publisherId        int
	publisherProjectId int

	token string
}

func New(url string, clientId int, clientSecret string, publihserId int, publisherProjectId int) *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
			Transport: &http.Transport{
				MaxIdleConns:    100,
				IdleConnTimeout: 15 * time.Second,
			},
		},

		url:                url,
		clientId:           clientId,
		clientSecret:       clientSecret,
		publisherId:        publihserId,
		publisherProjectId: publisherProjectId,
	}
}

func (c *Client) GetUserAttributes(userId string) ([]*ResponseAttribute, error) {
	if c.token == "" {
		err := c.fetchToken()
		if err != nil {
			return nil, err
		}
	}

	url := c.url + fmt.Sprintf("/attributes/users/%s/get_read_only", userId)
	payload := []byte(fmt.Sprintf(`{"publisher_id":%d,"publisher_project_id":%d}`, c.publisherId, c.publisherProjectId))
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("X-SERVER-AUTHORIZATION", c.token)

	response, err := c.httpClient.Do(request)
	if err != nil {
		return nil, err
	}

	if response.StatusCode == http.StatusForbidden {
		c.fetchToken()
		request.Header.Set("X-SERVER-AUTHORIZATION", c.token)
		response, err = c.httpClient.Do(request)
		if err != nil {
			return nil, err
		}
	}

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error while getting user attributes")
	}

	defer response.Body.Close()

	responseAttributes := new([]*ResponseAttribute)
	err = json.NewDecoder(response.Body).Decode(responseAttributes)
	if err != nil {
		return nil, err
	}

	return *responseAttributes, nil
}

func (c *Client) fetchToken() error {
	payload := url.Values{}
	payload.Set("grant_type", "client_credentials")
	payload.Set("client_id", strconv.Itoa(c.clientId))
	payload.Set("client_secret", c.clientSecret)

	request, err := http.NewRequest(http.MethodPost, c.url+"/oauth2/token", strings.NewReader(payload.Encode()))
	if err != nil {
		return err
	}

	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	response, err := c.httpClient.Do(request)
	if err != nil {
		return err
	}

	defer response.Body.Close()

	responseToken := new(ResponseToken)
	err = json.NewDecoder(response.Body).Decode(responseToken)
	if err != nil {
		return err
	}

	c.token = responseToken.AccessToken
	return nil
}
