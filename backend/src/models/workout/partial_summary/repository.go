package partial_summary

import "gorm.io/gorm"

func (ps *PartialSummary) Save(db *gorm.DB) error {
	return db.Save(ps).Error
}

func (ps *PartialSummary) Create(db *gorm.DB) error {
	return db.Create(ps).Error
}

func (ps *PartialSummary) Delete(db *gorm.DB) error {
	return db.Delete(ps).Error
}

func GetByWorkoutID(db *gorm.DB, workoutID uint) ([]PartialSummary, error) {
	var summaries []PartialSummary
	if err := db.Where("workout_id = ?", workoutID).Find(&summaries).Error; err != nil {
		return nil, err
	}
	return summaries, nil
}