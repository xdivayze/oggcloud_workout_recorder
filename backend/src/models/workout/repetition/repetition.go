package repetition

type Repetition struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	ExerciseID       uint      `json:"exercise_id" gorm:"not null"`   // Foreign key to Exercise
	Weight           int       `json:"weight" gorm:"not null"`        // Weight lifted in this repetition
	Unit             string    `json:"unit" gorm:"not null"`          // Unit of weight (e.g., kg, lbs)
	SetID            uint      `json:"set_id" gorm:"not null"`        // Foreign key to Set
	RepPositionInSet int       `json:"rep_no_in_set" gorm:"not null"` // The position of this repetition in the set
}
