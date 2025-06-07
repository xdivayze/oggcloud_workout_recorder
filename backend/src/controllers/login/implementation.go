package login

import (
	"backend/src/models/auth_code"
	user_module "backend/src/models/user"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func hashPassword(password string) (string, error) { //use bcrypt to hash the sent password hash
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func checkPassword(hashedPassword, password string) error { //use bcrypt to check the sent password hash
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func handleUserNotFound(user *user_module.User, loginID, password string, db *gorm.DB) error {
	// If user is not found, create a new user with the provided loginID and password
	user.LoginID = loginID
	hashedPassword, err := hashPassword(password)
	if err != nil {
		return fmt.Errorf("error hashing password: %w", err)
	}
	user.BCryptPassword = hashedPassword
	if err := user.Create(db); err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}
	return nil
}

func appendAuthCodeToUser(user *user_module.User, db *gorm.DB) (string, error) {
	bytes := make([]byte, auth_code.CODE_LENGTH)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("error generating random bytes for auth code: %w", err)
	}
	authCode := hex.EncodeToString(bytes) // Convert the random bytes to a hexadecimal string

	// Append the auth code to the user's AuthCodes slice
	newAuthCode := auth_code.AuthCode{
		Code:      authCode,
		ExpiresAt: time.Now().Add(auth_code.CODE_VALIDATION_LENGTH_MIN * time.Minute), // Set the expiration time to 60 minutes from now
	}

	// Append the new auth code to the user's AuthCodes association
	if err := db.Model(user).Association("AuthCodes").Append(&newAuthCode); err != nil {
		return "", fmt.Errorf("error appending auth code to user: %w", err)
	}
	return authCode, nil

}
