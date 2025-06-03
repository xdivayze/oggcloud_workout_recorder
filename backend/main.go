package main

import (
	"backend/src/db"
	"backend/src/routes"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

const PORT = 8080

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error occurred while loading dotenv file:\n\t%v\n", err)
	}

	err = db.ConnectDB()
	if err != nil {
		log.Fatalf("error occurred while connecting to db: \n\t%v", err)
	}

	r := gin.Default()
	routes.RegisterRoutes(r)
}
