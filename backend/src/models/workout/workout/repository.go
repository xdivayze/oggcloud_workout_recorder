package workout

import (
	"backend/src/models/workout/partial_summary"

	"gorm.io/gorm"
)

func (w *Workout) Save(db *gorm.DB) error {
	return db.Save(w).Error
}

func (w *Workout) Create(db *gorm.DB) error {
	return db.Create(w).Error
}
func (w *Workout) Delete(db *gorm.DB) error {
	return db.Delete(w).Error
}

func GetByName(db *gorm.DB, name string) (*Workout, error) {
	var workout Workout
	if err := db.First(&workout, "name = ?", name).Error; err != nil {
		return nil, err
	}
	return &workout, nil
}

func GetUserWorkoutFromWorkoutNameAndUserID(db *gorm.DB, userID uint, workoutName string) (*Workout, error) {
	var workout Workout
	if err := db.First(&workout, "user_id = ? AND exercise_name = ?", userID, workoutName).Error; err != nil {
		return nil, err
	}
	return &workout, nil
}

func (w *Workout) GetPartialSummaries(db *gorm.DB) ([]partial_summary.PartialSummary, error) {
	var summaries []partial_summary.PartialSummary
	if err := db.Model(w).Association("PartialSummaries").Find(&summaries); err != nil {
		return nil, err
	}
	return summaries, nil
}
