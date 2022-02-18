package middleware

import (
	"net/http"

	"whentheycry.ru/m/v2/web"
)

func HeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("X-Api-Version", web.BuildVersion)

		next.ServeHTTP(w, r)
	})
}
