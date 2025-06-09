package db

import (
	"backend/src/models/auth_code"
	user_model "backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/repetition"
	"backend/src/models/workout/session"
	"backend/src/models/workout/set"

	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

var TABLES = []interface{}{
	&user_model.User{},
	&auth_code.AuthCode{},
	&repetition.Repetition{},
	&set.Set{},
	&session.Session{},
	&exercise.Exercise{},
}

func ConnectDB() error {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn))
	if err != nil {
		return fmt.Errorf("Error occurred while connecting to postgres:\n\t%w\n", err)
	}

	DB = db
	log.Println("DB connection established")

	//db configs
	DB.Migrator().DropTable(TABLES...)
	DB.AutoMigrate(TABLES...)
	//--
	return nil

}
