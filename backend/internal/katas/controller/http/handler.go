package http

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/maabedelhay/kfkd/backend/internal/katas/service"
)

type Controler struct {
	ks *service.KataService
}

type Option func(*Controler)

func WithKataService(ks *service.KataService) Option {
	return func(ctr *Controler) {
		ctr.ks = ks
	}
}
func NewKataControler(opts ...Option) *Controler {
	ctr := &Controler{}
	for _, opt := range opts {
		opt(ctr)
	}
	return ctr
}
func (ctr *Controler) GetKata(eCtx *echo.Context) error {
	return eCtx.JSON(http.StatusOK,"hello kfkd")
}
