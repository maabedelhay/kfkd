package http

import (
	"net/http"
)

func (ctr *Controler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /kata/{id}",ctr.Get)
	mux.HandleFunc("GET /kata/list",ctr.List)
	mux.HandleFunc("POST /kata", ctr.Save)
}
