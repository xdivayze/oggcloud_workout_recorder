package user

import (
	"backend/src/models/auth_code"
)

type User struct {
	ID             uint   `gorm:"primaryKey"`
	LoginID        string `gorm:"unique"`
	BCryptPassword string
	AuthCodes      []auth_code.AuthCode `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
