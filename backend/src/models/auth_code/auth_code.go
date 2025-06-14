package auth_code

import (
	"time"
)
const CODE_LENGTH = 32
const CODE_VALIDATION_LENGTH_MIN = 60
const AUTH_CODE_FIELDNAME = "authCode"
const EXPIRES_AT_FIELDNAME = "expiresAt"

type AuthCode struct {
	ID        uint   `gorm:"primaryKey"`
	Code      string `gorm:"unique"`
	UserID    uint
	ExpiresAt time.Time
}
