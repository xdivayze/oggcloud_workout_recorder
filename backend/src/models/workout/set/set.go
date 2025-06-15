package set

import (
	"backend/src/models/workout/repetition"
	"time"
)

// this struct represents a set of repetitions in a workout
// it is used to group repetitions together, e.g. 3 sets of 10 repetitions
// it has a foreign key to the exercise model and a has many relationship with the repetition model
// it has a has many relationship with the session model
type Set struct {
	ID         uint                    `json:"id" gorm:"primaryKey"`                                                        // Unique identifier for the set
	ExerciseID uint                    `json:"exercise_id" gorm:"not null"`                                                 // Foreign key to Exercise
	Reps       []repetition.Repetition `json:"reps" gorm:"foreignKey:SetID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Repetitions in this set
	SessionID  uint                    `json:"session_id" gorm:"not null"`                                                  // Foreign key to Session
	SetNumber  uint                    `json:"set_number" gorm:"not null"`                                                  // The number of this set in the session
	CreatedAt  time.Time               `json:"created_at" gorm:"autoCreateTime"`                                            // Timestamp when the set was created
	UserID     uint                    `json:"user_id" gorm:"not null"`                                                     // Foreign key to User
}
