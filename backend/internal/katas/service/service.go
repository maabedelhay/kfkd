package service

import (
	"context"
	"time"

	"github.com/maabedelhay/kfkd/backend/internal/katas/entity"
	"github.com/sirupsen/logrus"
)

type KataRepo interface {
	Get(ctx context.Context, title string) (*entity.KataInfo, error)
	GetBydId(ctx context.Context, id string) (*entity.KataInfo, error)
	Save(ctx context.Context, kata *entity.KataInfo) error
	DelteById(ctx context.Context, id string) error
	List(ctx context.Context) ([]entity.KataInfo, error)
	InsertSolution(ctx context.Context, solveInfo *entity.SolveInfo) error
	CountSolvePerDate(ctx context.Context) (map[string]int, error)
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
		ks.log.Errorf("get kata by title=%s : %v", title, err)
		return &entity.KataInfo{}, err
	}
	return kata, nil
}

func (ks *KataService) Save(ctx context.Context, kata *entity.KataInfo) error {

	if err := ks.repo.Save(ctx, kata); err != nil {
		ks.log.Errorf("save kata=%s: %v", kata.Title, err)
		return err
	}
	ks.log.Infof("save kata=%s: success", kata.Title)
	return nil
}

func (ks *KataService) List(ctx context.Context) ([]entity.KataInfo, error) {

	katas, err := ks.repo.List(ctx)
	if err != nil {
		return []entity.KataInfo{}, err
	}

	return katas, nil
}

func (ks *KataService) GetKataById(ctx context.Context, id string) (*entity.KataInfo, error) {
	kata, err := ks.repo.GetBydId(ctx, id)
	if err != nil {
		ks.log.Errorf("get kata by Id=%s: %v", id, err)
		return &entity.KataInfo{}, err
	}
	return kata, nil
}

func (ks *KataService) DelteById(ctx context.Context, id string) error {
	if err := ks.repo.DelteById(ctx, id); err != nil {
		ks.log.Errorf("delete by id=%s: %v", id, err)
		return nil
	}
	return nil
}

func (ks *KataService) SaveSolution(ctx context.Context, solveInfo *entity.SolveInfo) error {
	if err := ks.repo.InsertSolution(ctx, solveInfo); err != nil {
		ks.log.Errorf("save solution: %v", err)
		return err
	}
	ks.log.Infof("save solution: success")
	return nil
}

// return 6 monthes from today. recive the cap (the request day) and get six monthes from it
// maybe i can give back an array of int for 6 months each index is a day and fill the other days with 0? no

// SolvedPerDay returns solve counts for the last 6 months (inclusive of today).
// If endDate is nil, uses time.Now().UTC().
func (ks *KataService) SolvedPerDay(ctx context.Context, reqEndDate *time.Time) ([]entity.DailySolveCount, error) {

	var end time.Time
	if reqEndDate != nil {
		end = reqEndDate.UTC()
	} else {
		end = time.Now().UTC()
	}

	start := end.AddDate(-1, 0, 0)

	actualCount, err := ks.repo.CountSolvePerDate(ctx)
	if err != nil {
		return nil, err
	}
	ks.log.Infof("solved per day \n%v",actualCount)
	days := make([]entity.DailySolveCount, 0)
	for d := start ; d.Before(end) || d.Equal(end); d = d.AddDate(0,0,1) {
		dateStr := d.Format("2006-01-02")
		count := actualCount[dateStr]
		days = append(days, entity.DailySolveCount{
			Date: dateStr,
			Count: count,
		})
	}
	return days, nil
}
