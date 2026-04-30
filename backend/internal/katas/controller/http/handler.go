package http

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/maabedelhay/kfkd/backend/internal/katas/entity"
	"github.com/maabedelhay/kfkd/backend/internal/katas/service"
	"github.com/sirupsen/logrus"
)

type KataService interface {
	Save(ctx context.Context, kata *entity.KataInfo) error
	DelteById(ctx context.Context, id string) error
	GetKataByTitle(ctx context.Context, title string) (*entity.KataInfo, error)
	GetKataById(ctx context.Context, id string) (*entity.KataInfo, error)
	List(ctx context.Context) ([]entity.KataInfo, error)
	SaveSolution(ctx context.Context, solveInfo *entity.SolveInfo) error
}
type Controler struct {
	ks  KataService
	log *logrus.Logger
}

type Option func(*Controler)

func WithKataService(ks *service.KataService) Option {
	return func(ctr *Controler) {
		ctr.ks = ks
	}
}

func WithLogger(l *logrus.Logger) Option {
	return func(c *Controler) {
		c.log = l
	}
}
func NewKataControler(opts ...Option) *Controler {
	ctr := &Controler{}
	for _, opt := range opts {
		opt(ctr)
	}
	return ctr
}

func (ctr *Controler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	title := r.URL.Query().Get("title")
	var err error
	var kata *entity.KataInfo
	if title != "" {
		kata, err = ctr.ks.GetKataByTitle(ctx, title)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

	} else {
		id := r.PathValue("id")
		if id == "" {
			ctr.log.Error("get kata no id")
			http.Error(w, "kata id query parameter is empty", http.StatusBadRequest)
			return
		}

		kata, err = ctr.ks.GetKataById(ctx, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	data, err := json.Marshal(kata)
	if err != nil {
		ctr.log.Errorf("get kata marshal: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)

}

func (ctr *Controler) Save(w http.ResponseWriter, r *http.Request) {
	kataReq := &entity.KataInfo{}
	ctx := r.Context()
	if err := json.NewDecoder(r.Body).Decode(kataReq); err != nil {
		ctr.log.Errorf("save kata invalid request: %v", err)
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if err := ctr.ks.Save(ctx, kataReq); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

}
func (ctr *Controler) SaveSolution(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	solve := &entity.SolveInfo{}
	if err := json.NewDecoder(r.Body).Decode(solve); err != nil {
		ctr.log.Errorf("save solution invalid request: %v", err)
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	if err := ctr.ks.SaveSolution(ctx, solve); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
}
func (ctr *Controler) List(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	katas, err := ctr.ks.List(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	data, err := json.Marshal(katas)
	if err != nil {
		ctr.log.Errorf("list kata marshal: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (ctr *Controler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := r.PathValue("id")
	if id == "" {
		ctr.log.Errorf("delete kata invalid request no id")
		http.Error(w, "invalid request no id", http.StatusBadRequest)
		return

	}
	if err := ctr.ks.DelteById(ctx, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
