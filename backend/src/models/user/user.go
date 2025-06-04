package user

import (
	"backend/src/models/auth_code"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	LoginID        string `gorm:"unique"`
	BCryptPassword string
	AuthCodes      []auth_code.AuthCode `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
