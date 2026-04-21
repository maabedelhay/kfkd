package main

import (
	"log"
	"net/http"

	kc "github.com/maabedelhay/kfkd/backend/internal/katas/controller/http"
	"github.com/maabedelhay/kfkd/backend/internal/katas/repo"
	"github.com/maabedelhay/kfkd/backend/internal/katas/service"
	"github.com/sirupsen/logrus"
)

func main() {
	logger := logrus.New()
	mux := http.NewServeMux()
	mw := kc.Middelware{Log: logger}

	kataRepo := repo.NewKataRepo(repo.WithSQLiteUri("./sqlitekatas.db"))
	
	kataService := service.NewKataService(service.WithKataRepo(kataRepo),service.WithLogger(logger))
	
	kataControler := kc.NewKataControler(kc.WithKataService(kataService),kc.WithLogger(logger))
	kataControler.RegisterRoutes(mux)

	server := http.Server{
		Addr:    ":8083",
		Handler: mw.EntryMiddelwareLog(mux),
	}
	log.Println("Listening...")
	server.ListenAndServe()

}
