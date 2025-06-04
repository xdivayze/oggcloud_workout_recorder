package routes

import (
	"backend/src/middleware"

	"github.com/gin-gonic/gin"
)

func protectedRoutes(rg *gin.RouterGroup) {
	// Protected routes that require authentication
	protected := rg.Group("/protected")
	protected.Use(middleware.AuthMiddleware()) // Apply the authentication middleware
	{
		protected.GET("/log-workout")
	}

}
