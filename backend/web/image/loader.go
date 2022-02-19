package image

import (
	"image"
	"image/jpeg"
	"net/http"
	"time"
)

type Loader struct {
	httpClient *http.Client
}

func NewLoader() *Loader {
	return &Loader{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
			Transport: &http.Transport{
				MaxIdleConns:    100,
				IdleConnTimeout: 15 * time.Second,
			},
		},
	}
}

func (l *Loader) GetImage(url string) (image.Image, error) {
	res, err := l.httpClient.Get(url)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	m, err := jpeg.Decode(res.Body)
	if err != nil {
		return nil, err
	}

	return m, nil
}
