package http

import (
	"net/http"

	"github.com/sirupsen/logrus"
)

type Middelware struct {
	Log *logrus.Logger
}

func (mw *Middelware) EntryMiddelwareLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//some
		mw.Log.Infof("%s %s",r.Method,r.URL)
		next.ServeHTTP(w, r)
	})
}
