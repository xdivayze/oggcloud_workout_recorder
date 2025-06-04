package user

import (
	"fmt"

	"gorm.io/gorm"
)

func GetByLoginID(db *gorm.DB, login string) (*User, error) {
	var user User
	if err := db.Preload("AuthCodes").First(&user, "login_id = ?", login).Error; err != nil {
		return nil, fmt.Errorf("error occurred while retrieving user:\n\t%w\n", err)
	}
	return &user, nil
}

func (user *User) Delete(db *gorm.DB) error {
	return db.Delete(&user).Error
}

func (user *User) Save(db *gorm.DB) error {
	return db.Save(&user).Error
}

func (user *User) Create(db *gorm.DB) error {
	return db.Create(&user).Error
}
