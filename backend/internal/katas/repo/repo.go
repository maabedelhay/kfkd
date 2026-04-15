package repo

import (
	"database/sql"
    "github.com/maabedelhay/kfkd/backend/internal/katas/entity"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/sqlitedialect"
	"github.com/uptrace/bun/driver/sqliteshim"
)

// create sqlite repo with methods that can ve crated and used in main
type KataRepo struct {
	db  *bun.DB
	uri string
}
type Option func(*KataRepo)

func WithSQLiteUri(uri string) Option {
	return func(kr *KataRepo) {
		kr.uri = uri
	}
}
func NewKataRepo(opts ...Option) *KataRepo {
	repo := &KataRepo{}
	for _, opt := range opts {
		opt(repo)
	}
	sqldb, err := sql.Open(sqliteshim.ShimName, repo.uri)
	if err != nil {
		panic(err)
	}
	repo.db = bun.NewDB(sqldb, sqlitedialect.New())
	return repo
}

// retrive a kata
func (kr *KataRepo) Get() (entity.KataInfo, error) {

	return entity.KataInfo{}, nil
}

func (kr *KataRepo) List() ([]entity.KataInfo, error) {
	katas := ([]entity.KataInfo)(nil)
	return katas, nil
}
