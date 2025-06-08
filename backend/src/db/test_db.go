package db

import (
	"backend/src/models/user"

	"encoding/hex"
	"fmt"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"gorm.io/driver/sqlite"
)

func TestDB() error {
	//initialize sqlite in-memory database

	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to the database:\n\t %w\n", err)
	}
	// Migrate the schema
	err = db.AutoMigrate(TABLES...)
	if err != nil {
		return fmt.Errorf("failed to migrate the database schema:\n\t %w\n", err)
	}

	DB = db

	return nil

}

func CreateTestUser(loginID string, password string) (*user.User, error) {
	bcryptPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password:\n\t %w\n", err)
	}

	testUser := &user.User{
		LoginID:        loginID,
		BCryptPassword: hex.EncodeToString(bcryptPassword),
	}

	if err := testUser.Create(DB); err != nil {
		return nil, fmt.Errorf("failed to create test user:\n\t %w\n", err)
	}
	return testUser, nil
}
