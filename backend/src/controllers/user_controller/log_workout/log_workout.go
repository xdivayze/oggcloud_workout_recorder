package log_workout

import (
	"backend/src/db"
	user_model "backend/src/models/user" // Assuming user is a package that contains the User model
	"backend/src/models/workout/partial_summary"
	"backend/src/models/workout/workout"
	"errors"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// HandleLogWorkout is the handler function for logging a workout.
func HandleLogWorkout(c *gin.Context) {
	user := c.MustGet("user").(*user_model.User) // Get the user from the context, assuming middleware sets it

	logWorkoutRequest := LogWorkoutRequest{}
	if err := c.ShouldBindJSON(&logWorkoutRequest); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request data"})
		return
	}
	if len(logWorkoutRequest.PartialSummaries) == 0 {
		c.JSON(400, gin.H{"error": "No workout data provided"})
		return
	}

	for _, summary := range logWorkoutRequest.PartialSummaries {
		retrievedWorkout, err := workout.GetUserWorkoutFromWorkoutNameAndUserID(db.DB, user.ID, summary.ExerciseName)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// If the workout is not found, create a new one
				createdWorkout, err := HandleWorkoutNotFound(summary.ExerciseName, user.ID, db.DB)
				if err != nil {
					c.JSON(500, gin.H{"error": "Error creating new workout"})
					return
				}
				retrievedWorkout = createdWorkout
			} else {
				c.JSON(500, gin.H{"error": "Error retrieving workout"})
				return
			}
		}
		// append the new summary to the workout
		newPartialSummary := &partial_summary.PartialSummary{
			SetNo:    summary.SetNo,
			RepCount: summary.RepCount,
			Weight:   summary.Weight,
			Unit:     summary.Unit,
		}
		if err := AppendPartialSummaryToWorkout(retrievedWorkout, newPartialSummary, db.DB); err != nil {
			c.JSON(500, gin.H{"error": "Error appending partial summary to workout"})
			return
		}

	}

	c.JSON(200, gin.H{"message": "Workout logged successfully"})

}
