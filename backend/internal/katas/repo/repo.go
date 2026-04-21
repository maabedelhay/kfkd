package repo

import (
	"context"
	"database/sql"
	"strconv"

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
func CreateTables(ctx context.Context, db *bun.DB) error {
	_, err := db.NewCreateTable().Model((*Kata)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		return err
	}
	_, err = db.NewCreateTable().Model((*KataTag)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		return err
	}
	_, err = db.NewCreateTable().Model((*Solve)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		return err
	}
	return nil
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
	CreateTables(context.Background(), repo.db)
	return repo
}

// retrive a kata
func (r *KataRepo) Get(ctx context.Context, title string) (*entity.KataInfo, error) {
	kata := &Kata{}
	err := r.db.NewSelect().Model(kata).Where("title = ?", title).Relation("Tags").Scan(ctx)
	k := ModelToKataInfo(kata)
	return &k, err
}
func (r *KataRepo) GetBydId(ctx context.Context, id string) (*entity.KataInfo, error) {
	kata := &Kata{}
	intId, err := strconv.Atoi(id)
	if err != nil {
		return &entity.KataInfo{}, err
	}
	err = r.db.NewSelect().Model(kata).Where("id = ?", intId).Relation("Tags").Scan(ctx)
	if err != nil {
		return &entity.KataInfo{}, err
	}
	k := ModelToKataInfo(kata)
	return &k, err
}

func (kr *KataRepo) List(ctx context.Context) ([]entity.KataInfo, error) {
	katas := []Kata{}
	if err := kr.db.NewSelect().Model(&katas).Relation("Tags").Scan(ctx); err != nil {
		return []entity.KataInfo{}, err
	}
	katasInfo := []entity.KataInfo{}
	for _, kata := range katas {
		katasInfo = append(katasInfo, ModelToKataInfo(&kata))
	}
	return katasInfo, nil
}

func (kr *KataRepo) Save(ctx context.Context, kata *entity.KataInfo) error {
	return kr.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {

		kataModel := KataInfoToModel(kata)
		_, err := tx.NewInsert().Model(&kataModel).Exec(ctx)
		if err != nil {
			return err
		}

		if len(kata.Tags) > 0 {
			for i := range kataModel.Tags {
				kataModel.Tags[i].KataID = kataModel.ID
			}
			_, err := tx.NewInsert().Model(&kataModel.Tags).Exec(ctx)
			if err != nil {
				return err
			}
		}
		return nil
	})
}

func KataInfoToModel(kataInfo *entity.KataInfo) Kata {
	kata := Kata{
		Title:      kataInfo.Title,
		Content:    kataInfo.Content,
		Difficulty: kataInfo.Difficulty,
		Note:       kataInfo.Note,
	}
	if len(kataInfo.Tags) > 0 {
		for _, tag := range kataInfo.Tags {
			kata.Tags = append(kata.Tags, KataTag{Tag: tag})
		}
	}
	return kata
}

func ModelToKataInfo(kata *Kata) entity.KataInfo {
	info := entity.KataInfo{
		Title:      kata.Title,
		Content:    kata.Content,
		Difficulty: kata.Difficulty,
		Note:       kata.Note,
		CreatedAt:  kata.CreatedAt,
		ID:         kata.ID,
	}
	for _, kataTag := range kata.Tags {
		info.Tags = append(info.Tags, kataTag.Tag)
	}
	return info
}
