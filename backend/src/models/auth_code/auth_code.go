package auth_code

import (
	"time"
)

type AuthCode struct {
	ID        uint   `gorm:"primaryKey"`
	Code      string `gorm:"unique"`
	UserID    uint
	ExpiresAt time.Time
}
