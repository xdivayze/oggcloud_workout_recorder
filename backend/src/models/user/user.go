package user

import (
	"backend/src/models/auth_code"
	"backend/src/models/workout/workout"
)

type User struct {
	ID             uint   `gorm:"primaryKey"`
	LoginID        string `gorm:"unique"`
	BCryptPassword string
	Workouts       []workout.Workout    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	AuthCodes      []auth_code.AuthCode `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
