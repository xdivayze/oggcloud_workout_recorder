package db

import (
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"fmt"

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
	err = db.AutoMigrate(&user.User{}, &auth_code.AuthCode{})
	if err != nil {
		return fmt.Errorf("failed to migrate the database schema:\n\t %w\n", err)
	}

	DB = db
	
	return nil

}
