package repetition

import "gorm.io/gorm"

func (r *Repetition) Save(db *gorm.DB) error {
	return db.Save(r).Error
}

func (r *Repetition) Create(db *gorm.DB) error {
	return db.Create(r).Error
}

func (r *Repetition) Delete(db *gorm.DB) error {
	return db.Delete(r).Error
}
