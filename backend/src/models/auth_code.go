package models

import (
	"time"

	"gorm.io/gorm"
)

type AuthCode struct {
	gorm.Model
	Code string `gorm:"unique"`
	UserID string
	ExpiresAt time.Time
}