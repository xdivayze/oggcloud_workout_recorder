package set

import (
	"gorm.io/gorm"
)

func (s *Set) Save(db *gorm.DB) error {
	return db.Save(s).Error
}
func (s *Set) Create(db *gorm.DB) error {
	return db.Create(s).Error
}
func (s *Set) Delete(db *gorm.DB) error {
	return db.Delete(s).Error
}

func GetBySessionIDAndExerciseNameAndSetNumber(db *gorm.DB, sessionID uint, exerciseID uint, setNumber int) (*Set, error) {
	var set Set
	if err := db.First(&set, "session_id = ? AND exercise_id = ? AND set_number = ?", sessionID, exerciseID, setNumber).Error; err != nil {
		return nil, err
	}
	return &set, nil
}

func GetByCreatedAtDescAndUserIDAndStartsWith(db *gorm.DB, userID uint, startsWith string) ([]Set, error) {
	var sets []Set
	if err := db.Where("user_id = ? AND LOWER(exercise_name) LIKE ?", userID, startsWith+"%"). // Use ILIKE for case-insensitive search
													Order("created_at DESC").Find(&sets).Error; err != nil {
		return nil, err
	}
	if len(sets) == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return sets, nil
}
