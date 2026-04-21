package repo

import (
	"time"

	"github.com/uptrace/bun"
)

type Kata struct {
	bun.BaseModel `bun:"table:kata"`

	ID         int64     `bun:",pk,autoincrement"`
	Title      string    `bun:",notnull,unique"`
	Content    string    `bun:",notnull"`
	Note       string    `bun:""`
	Difficulty string    `bun:""`
	CreatedAt  time.Time `bun:",default:current_timestamp"`
	Lines      int64     `bun:""`

	Tags []KataTag `bun:"rel:has-many,join:id=kata_id"`
}

type KataTag struct {
	bun.BaseModel `bun:"table:kata_tag"`
	KataID        int64  `bun:",pk"`
	Tag           string `bun:",pk"`
}

type Solve struct {
	bun.BaseModel `bun:"table:solve"`
	ID            int64     `bun:",pk,autoincrement"`
	KataID        int64     `bun:",notnull"`
	SolvedAt      time.Time `bun:",default:current_timestamp"`
	DurationSec   int32     `bun:""`
	Quality       int32     `bun:""`
}
