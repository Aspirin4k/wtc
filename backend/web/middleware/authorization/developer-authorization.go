package authorization

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"whentheycry.ru/m/v2/web/xsolla"
)

func DeveloperAuthorizationMiddleware(next http.Handler, client *xsolla.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		rawToken := ctx.Value("token")
		if rawToken == nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token := rawToken.(*jwt.Token)
		userId, err := token.Claims.GetSubject()
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		attributes, err := client.GetUserAttributes(userId)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		for _, attribute := range attributes {
			if attribute.Key == "is_developer" {
				if attribute.Value == "true" {
					next.ServeHTTP(w, r)
				} else {
					w.WriteHeader(http.StatusUnauthorized)
				}
				return
			}
		}

		w.WriteHeader(http.StatusUnauthorized)
	})
}
