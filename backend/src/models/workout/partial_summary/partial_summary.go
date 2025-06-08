package partial_summary

import "time"

type PartialSummary struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	SetNo      int     `json:"set_no" gorm:"not null"`
	RepCount   int     `json:"rep_count" gorm:"not null"`
	WorkoutID uint     `json:"workout_id" gorm:"not null"`
	Weight     int `json:"weight" gorm:"not null"`
	Unit       string  `json:"unit" gorm:"not null"`
	CreatedAt  time.Time  `json:"created_at" gorm:"autoCreateTime"`
}
