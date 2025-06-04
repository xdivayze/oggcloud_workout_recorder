package auth_code

import (
	"fmt"

	"gorm.io/gorm"
)

func GetByCode(db *gorm.DB, code string) (*AuthCode, error) {
	var authCode AuthCode
	if err := db.First(&authCode, "code = ?", code).Error; err != nil {
		return nil, fmt.Errorf("error occurred while retrieving authCode:\n\t%w\n", err)
	}
	return &authCode, nil

}

func GetUserAuthCode(db *gorm.DB, userID uint, authCode string) (*AuthCode, error) {
	var authCodeObj AuthCode
	if err := db.First(&authCodeObj, "user_id = ? AND code = ?", userID, authCode).Error; err != nil {
		return nil, fmt.Errorf("error occurred while retrieving user auth code:\n\t%w\n", err)
	}
	return &authCodeObj, nil
}

func (authCode *AuthCode) Delete(db *gorm.DB) error {
	return db.Delete(&authCode).Error
}

func (authCode *AuthCode) Save(db *gorm.DB) error {
	return db.Save(&authCode).Error
}
