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

// mybe would be better as upsert
func (kr *KataRepo) Save(ctx context.Context, kata *entity.KataInfo) error {
	return kr.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {

		kataModel := KataInfoToModel(kata)
		_, err := tx.NewInsert().Model(&kataModel).On("CONFLICT (title) DO UPDATE SET content = EXCLUDED.content, note = EXCLUDED.note, lines = EXCLUDED.lines").Exec(ctx)
		if err != nil {
			return err
		}

		if len(kata.Tags) > 0 {
			for i := range kataModel.Tags {
				kataModel.Tags[i].KataID = kataModel.ID
			}
			_, err := tx.NewInsert().Model(&kataModel.Tags).On("CONFLICT (kata_id, tag) DO NOTHING").Exec(ctx)
			if err != nil {
				return err
			}
		}
		return nil
	})
}

func (kr *KataRepo) DelteById(ctx context.Context, id string) error {
	_, err := kr.db.NewDelete().Model((*Kata)(nil)).Where("id = ?", id).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (kr *KataRepo) InsertSolution(ctx context.Context, solveInfo *entity.SolveInfo) error {
	solve := SolveInfoToModel(solveInfo)
	_, err := kr.db.NewInsert().Model(&solve).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

// count ber date how many entry. group by same date.

func (kr *KataRepo) CountSolvePerDate(ctx context.Context) (map[string]int, error) {
	var result []struct {
		Date  string `bun:"date"`
		Count int    `bun:"count"`
	}

	err := kr.db.NewSelect().Model((*Solve)(nil)).ColumnExpr("DATE(solved_at) as date").ColumnExpr("COUNT(id) as count").GroupExpr("DATE(solved_at)").OrderExpr("DATE(solved_at) ASC").Scan(ctx, &result)
	if err != nil {
		return nil, err
	}
	dateCount := make(map[string]int, 0)
	for _, r := range result {
		dateCount[r.Date] = r.Count
	}
	return dateCount, nil
}
