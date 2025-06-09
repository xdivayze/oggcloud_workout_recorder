package session

import (
	"backend/src/models/workout/set"
	"time"
)

// Session represents a workout session containing multiple sets of different exercises.
type Session struct {
	ID     uint      `json:"id" gorm:"primaryKey"`
	UserID uint      `json:"user_id" gorm:"not null"`                                                         // Foreign key to User
	Sets   []set.Set     `json:"sets" gorm:"foreignKey:SessionID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Sets in this session
	Date   time.Time `json:"date" gorm:"not null"`                                                            // Date of the session
	Volume float64   `json:"volume" gorm:"not null"`
	                                                          // Total volume of the session
}
