package main

import (
	"backend/src/routes"

	"github.com/gin-gonic/gin"
)

const PORT = 8080

func main() {
	r := gin.Default()
	routes.RegisterRoutes(r)
}
