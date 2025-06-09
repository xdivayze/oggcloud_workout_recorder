package user

import (
	"backend/src/models/auth_code"
	"backend/src/models/workout/session"
)

type User struct {
	ID             uint   `gorm:"primaryKey"`
	LoginID        string `gorm:"unique"`
	BCryptPassword string
	Sessions       []session.Session    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	AuthCodes      []auth_code.AuthCode `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
