package routes

import (
	"backend/src/controllers/user_controller/log_workout"
	"backend/src/controllers/user_controller/progress"
	"backend/src/controllers/user_controller/search_name_fetch"
	"backend/src/middleware"

	"github.com/gin-gonic/gin"
)

func protectedRoutes(rg *gin.RouterGroup) {
	// Protected routes that require authentication
	protected := rg.Group("/protected")
	protected.Use(middleware.AuthMiddleware()) // Apply the authentication middleware
	{
		protected.POST("/log-workout", log_workout.HandleLogWorkout)
		protected.GET("/get-progress", progress.HandleGetProgress)
		protected.GET("/fetch-exercise-names", search_name_fetch.HandleFetchExerciseNames)
	}

}
