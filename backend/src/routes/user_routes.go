package routes

import (
	"backend/src/controllers/user_controller/login"

	"github.com/gin-gonic/gin"
)

func userRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/user")
	{
		users.POST("/login", login.HandleLogin)

		
	}
}