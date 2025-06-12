package main

import (
	"backend/src/db"
	"backend/src/routes"
	"fmt"
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

	defer func() {
		defer db.DB.Migrator().DropTable(db.TABLES...)
		log.Println("Database connection closed")
	}()

	r := gin.Default()
	routes.RegisterRoutes(r)

	if err := r.Run(fmt.Sprintf(":%d", PORT)); err != nil {
		log.Fatalf("error occurred while running the server: \n\t%v", err)
	}

	log.Printf("Server is running on port %d", PORT)

}
