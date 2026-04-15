package main

import (
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/maabedelhay/kfkd/backend/internal/katas/controller/http"
	"github.com/maabedelhay/kfkd/backend/internal/katas/repo"
	"github.com/maabedelhay/kfkd/backend/internal/katas/service"
)

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())


	kataRepo := repo.NewKataRepo(repo.WithSQLiteUri(""))
	kataService := service.NewKataService(service.WithKataRepo(kataRepo))
	kataControler := http.NewKataControler(http.WithKataService(kataService))
	kataControler.RegisterRoutes(e)

	if err := e.Start(":8083"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}

}
