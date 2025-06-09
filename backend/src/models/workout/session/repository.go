package session

import (
	"time"

	"gorm.io/gorm"
)

func (s *Session) Save(db *gorm.DB) error {
	return db.Save(s).Error
}

func (s *Session) Create(db *gorm.DB) error {
	return db.Create(s).Error
}

func (s *Session) Delete(db *gorm.DB) error {
	return db.Delete(s).Error
}

func GetByUserIDAndDate(db *gorm.DB, userID uint, date time.Time) (*Session, error) {
	var session Session
	if err := db.First(&session, "user_id = ? AND date = ?", userID, date).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

func GetAllByUserID(db *gorm.DB, userID uint) ([]Session, error) {
	var sessions []Session
	if err := db.Where("user_id = ?", userID).Find(&sessions).Error; err != nil {
		return nil, err
	}
	return sessions, nil
}