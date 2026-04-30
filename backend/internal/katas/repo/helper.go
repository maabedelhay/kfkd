package repo

import "github.com/maabedelhay/kfkd/backend/internal/katas/entity"

func KataInfoToModel(kataInfo *entity.KataInfo) Kata {
	kata := Kata{
		Title:      kataInfo.Title,
		Content:    kataInfo.Content,
		Difficulty: kataInfo.Difficulty,
		Note:       kataInfo.Note,
		Lines:      kataInfo.Lines,
		ProgLang:   kataInfo.ProgLang,
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
		Lines:      kata.Lines,
		ProgLang:   kata.ProgLang,
	}
	for _, kataTag := range kata.Tags {
		info.Tags = append(info.Tags, kataTag.Tag)
	}
	return info
}

func SolveInfoToModel(solveInfo *entity.SolveInfo) Solve {
	return Solve{
		KataID:      solveInfo.KataID,
		SolvedAt:    solveInfo.SolvedAt,
		DurationSec: solveInfo.DurationSec,
		Quality:     solveInfo.Quality,
	}
}

func ModelToSolveInfo(solve *Solve) entity.SolveInfo {
	return entity.SolveInfo{
		KataID:      solve.KataID,
		SolvedAt:    solve.SolvedAt,
		DurationSec: solve.DurationSec,
		Quality:     solve.Quality,
		ID:          solve.ID,
	}
}
