package authorization

import (
	"context"
	"crypto/rsa"
	"fmt"
	"math/big"
	"net/http"
	"regexp"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
)

var (
	publicKeyE   = "10001"
	publicKeyN   = "a6f87e24de60e7d1296adff574e98165572dfe6c994fb8d06316145d7d86b83b0254c487aaad62a31aa103b6c2a5c5486f1933163fa1fd34634093f3ba48fdd8796429f6e8f3137101d1ba157614c5f58473175944198dd54fc756281651b8c768cd83fe3cd3336af2f3a83038fde0c39fcc809b224d9aaad07505606fe25b230c192a1aa787d4be068dde1ec5cd52238da613bd3a7e7bb1292f6ce76c888a282154abfb8d9f02e6627a19fdb4a0b9ae58b2c585ecb723a94c0038da9bdf564a54f7fe88b69510ebd8661bb5790fa6fc139e1d09f0cbc437b425892113249771d65e6de4145dd39d2645eeb0fe2c60dc064889be51b212d657c968a035fdde13"
	bearerRegexp = regexp.MustCompile("^Bearer (.+)$")
)

func AuthorizationMiddleware(next http.Handler) http.Handler {
	key := decodePublicKey()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tokenGroup := bearerRegexp.FindStringSubmatch(tokenString)
		if len(tokenGroup) < 2 {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token, err := validate(tokenGroup[1], key)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		ctx := r.Context()
		next.ServeHTTP(w, r.WithContext(context.WithValue(ctx, "token", token)))
	})
}

func decodePublicKey() *rsa.PublicKey {
	e, _ := strconv.ParseInt(publicKeyE, 16, 32)

	n := new(big.Int)
	n.SetString(publicKeyN, 16)

	return &rsa.PublicKey{
		E: int(e),
		N: n,
	}
}

func validate(tokenString string, key *rsa.PublicKey) (*jwt.Token, error) {
	parsedToken, err := jwt.Parse(
		tokenString,
		func(t *jwt.Token) (interface{}, error) {
			return key, nil
		},
	)

	if err != nil {
		fmt.Print(err.Error())
		return nil, err
	}

	if !parsedToken.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return parsedToken, nil
}
