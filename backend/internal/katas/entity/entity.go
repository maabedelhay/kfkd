package entity

import "time"

type KataInfo struct {
	Title      string    
	Content    string    
	Note       string    
	Difficulty int64     
	CreatedAt  time.Time `json:"created_at"`
}
