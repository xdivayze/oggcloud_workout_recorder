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

func GetAllBySetIDAndWeightDesc(db *gorm.DB, setID uint) ([]Repetition, error) {
	var repetitions []Repetition
	if err := db.Where("set_id = ?", setID).Order("weight DESC").Find(&repetitions).Error; err != nil {
		return nil, err
	}
	if len(repetitions) == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return repetitions, nil
}