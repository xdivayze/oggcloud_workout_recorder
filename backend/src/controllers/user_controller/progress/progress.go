package progress

import (
	"backend/src/db"
	"backend/src/models/user"
	"backend/src/models/workout/workout"
	"errors"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//This function will return a graph of the user's progress
//on a specific exercise for a specific time period.
//It will return image/png data without any json data

func HandleGetProgress(c *gin.Context) {

	params := c.Request.URL.Query()
	exerciseName := params.Get(workout.EXERCISE_NAME_QUERY_PARAM)
	startTime := params.Get("start_time")
	endTime := params.Get("end_time")
	color := params.Get("color")

	if exerciseName == "" || startTime == "" || endTime == "" || color == "" {
		// If any parameter is missing, return a 400 Bad Request error
		c.JSON(400, gin.H{"error": "a parameter is missing"})
		return
	}
	userID := c.MustGet("user").(*user.User).ID
	w, err := workout.GetUserWorkoutFromWorkoutNameAndUserID(db.DB, userID, exerciseName)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "workout not found"})
			return
		} else {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
	}
	generateProgressPlot(w)

}
