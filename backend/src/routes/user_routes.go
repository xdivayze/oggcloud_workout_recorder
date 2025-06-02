package routes

import "github.com/gin-gonic/gin"

func userRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/user")
	{
		users.POST("/login")
		users.POST("/log-workout")
	}
}