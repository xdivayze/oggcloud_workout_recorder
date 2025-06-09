package repetition

type Repetition struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	WorkoutID uint   `json:"workout_id" gorm:"not null"`
	