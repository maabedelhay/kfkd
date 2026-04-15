package service

import (
	"github.com/maabedelhay/kfkd/backend/internal/katas/entity"
	"github.com/maabedelhay/kfkd/backend/internal/katas/repo"
)
type KataService struct {
	repo *repo.KataRepo
}
type Option func(*KataService)

func WithKataRepo(repo *repo.KataRepo) Option {
	return func(ks *KataService) {
		ks.repo = repo
	}
}
func NewKataService(opts...Option) *KataService {
	ks := &KataService{}
	for _, opt := range opts {
		opt(ks)
	}
	return ks
}
func (ks *KataService) Get() (entity.KataInfo,error) {
	return entity.KataInfo{}, nil
}