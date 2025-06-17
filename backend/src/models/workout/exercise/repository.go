package exercise

import "gorm.io/gorm"

func (e *Exercise) Save(db *gorm.DB) error {
	return db.Save(e).Error
}

func (e *Exercise) Create(db *gorm.DB) error {
	return db.Create(e).Error
}

func (e *Exercise) Delete(db *gorm.DB) error {
	return db.Delete(e).Error
}
func GetByName(db *gorm.DB, name string) (*Exercise, error) {
	var exercise Exercise
	if err := db.First(&exercise, "name = ?", name).Error; err != nil {
		return nil, err
	}
	return &exercise, nil
}

func GetAllByStartsWith(db *gorm.DB, startsWith string) ([]Exercise, error) {
	var exercises []Exercise
	if err := db.Where("LOWER(name) LIKE ?", startsWith+"%").Find(&exercises).Error; err != nil {
		return nil, err
	}
	if len(exercises) == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return exercises, nil
}

func GetByID(db *gorm.DB, id uint) (*Exercise, error) {
	var exercise Exercise
	if err := db.First(&exercise, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &exercise, nil
}