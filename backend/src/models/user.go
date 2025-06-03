package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID             string `gorm:"primaryKey"`
	BCryptPassword string
	AuthCodes      []AuthCode `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
