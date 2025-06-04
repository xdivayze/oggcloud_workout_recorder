package auth_code

import (
	"time"

	"gorm.io/gorm"
)

type AuthCode struct {
	gorm.Model
	Code      string `gorm:"unique"`
	UserID    uint
	ExpiresAt time.Time
}
