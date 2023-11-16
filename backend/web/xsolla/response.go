package xsolla

type ResponseToken struct {
	AccessToken string `json:"access_token"`
}

type ResponseAttribute struct {
	DataType   string `json:"data_type"`
	Key        string `json:"key"`
	Permission string `json:"permission"`
	Value      string `json:"value"`
}
