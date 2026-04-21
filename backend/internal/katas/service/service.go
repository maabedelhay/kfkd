package service

import (
	"context"

	"github.com/maabedelhay/kfkd/backend/internal/katas/entity"
	"github.com/sirupsen/logrus"
)

type KataRepo interface {
	Get(ctx context.Context, title string) (*entity.KataInfo, error)
	Save(ctx context.Context, kata *entity.KataInfo) error
	List(ctx context.Context) ([]entity.KataInfo, error)
}
type KataService struct {
	repo KataRepo
	log  *logrus.Logger
}
type Option func(*KataService)

func WithKataRepo(repo KataRepo) Option {
	return func(ks *KataService) {
		ks.repo = repo
	}
}

func WithLogger(l *logrus.Logger) Option {
	return func(ks *KataService) {
		ks.log = l
	}
}

func NewKataService(opts ...Option) *KataService {
	ks := &KataService{}
	for _, opt := range opts {
		opt(ks)
	}
	return ks
}

func (ks *KataService) GetKataByTitle(ctx context.Context, title string) (*entity.KataInfo, error) {
	kata, err := ks.repo.Get(ctx, title)
	if err != nil {
		return &entity.KataInfo{}, err
	}
	return kata, nil
}

func (ks *KataService) Save(ctx context.Context, kata *entity.KataInfo) error {
	if err := ks.repo.Save(ctx, kata); err != nil {
		ks.log.Error()
		return err
	}
	return nil
}

func (ks *KataService) List(ctx context.Context) ([]entity.KataInfo, error) {

	katas, err := ks.repo.List(ctx)
	if err != nil {
		return []entity.KataInfo{}, err
	}

	return katas, nil
}