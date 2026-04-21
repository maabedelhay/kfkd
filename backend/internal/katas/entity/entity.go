package entity

import (
	"encoding/base64"
	"encoding/json"
	"time"
)

type KataInfo struct {
	ID         int64     `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	Note       string    `json:"note"`
	Difficulty string    `json:"difficulty"`
	CreatedAt  time.Time `json:"created_at"`
	Tags       []string  `json:"tags"`
	Lines      int64     `json:"lines"`
}

func (kt *KataInfo) UnmarshalJSON(data []byte) error {
	type Alias KataInfo
	var kata Alias
	err := json.Unmarshal(data, &kata)
	if err != nil {
		return err
	}
	stringContent, err := base64.StdEncoding.DecodeString(kata.Content)
	if err != nil {
		return err
	}
	stringNote, err := base64.StdEncoding.DecodeString(kata.Note)
	if err != nil {
		return err
	}
	kt.Title = kata.Title
	kt.Content = string(stringContent)
	kt.Note = string(stringNote)
	kt.Difficulty = kata.Difficulty
	kt.Tags = kata.Tags
	kt.Lines = kata.Lines

	return nil
}
