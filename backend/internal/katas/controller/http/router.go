package http

import "github.com/labstack/echo/v5"

func (ctr *Controler) RegisterRoutes(e *echo.Echo) {
	e.GET("kata", ctr.GetKata)
}
