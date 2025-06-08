package workout

import "backend/src/models/workout/partial_summary"

//Workout unites all of user's partial summaries for a specific exercise.
type Workout struct { 
	ID               uint                              `json:"id" gorm:"primaryKey"`
	UserID           uint                              `json:"user_id" gorm:"not null"`
	ExerciseName     string                           `json:"exercise_name" gorm:"not null"`
	PartialSummaries []partial_summary.PartialSummary `json:"partial_summaries" gorm:"foreignKey:WorkoutID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Assuming PartialSummary has a WorkoutID field
}
