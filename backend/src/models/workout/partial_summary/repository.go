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

func GetByWorkoutIDAndUserID(db *gorm.DB, workoutID, userID uint) ([]PartialSummary, error) {
	//returns all partial summaries for a specific workout and user, newest first

	var summaries []PartialSummary
	err := db.Model(&PartialSummary{}).
		Where("workout_id = ? AND user_id = ?", workoutID, userID).
		Order("created_at DESC").
		Find(&summaries).Error
	if err != nil {
		return nil, err
	}
	

	return summaries, nil
}
