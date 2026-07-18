package http

import (
	"net/http"

	"github.com/sirupsen/logrus"
)

type Middelware struct {
	Log *logrus.Logger
}
// corsMiddleware adds CORS headers and handles preflight OPTIONS requests.
// Allows requests from the Next.js dev server (localhost:3000) and any
// other origin for local development. Tighten AllowedOrigins for production.
func (mw *Middelware) CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}
 
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "86400")
 
		// Respond to preflight immediately — no further handling needed.
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
 
		next.ServeHTTP(w, r)
	})
}
 

func (mw *Middelware) EntryMiddelwareLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//some
		mw.Log.Infof("%s %s",r.Method,r.URL)
		next.ServeHTTP(w, r)
	})
}

