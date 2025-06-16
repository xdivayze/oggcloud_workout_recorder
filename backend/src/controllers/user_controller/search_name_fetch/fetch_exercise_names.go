package search_name_fetch

import (
	"backend/src/db"
	"backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/set"
	"errors"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleFetchExerciseNames(c *gin.Context) {
	// This function handles the request to fetch recently
	// saved sets' exercise names. for displaying in the frontend
	// search bar.

	params := c.Request.URL.Query()
	startsWith := params.Get("starts_with") // nullable
	user := c.MustGet("user").(*user.User)  // Get the user from the context, assuming middleware sets it
	fetchedSets, err := set.GetByCreatedAtDescAndUserID(db.DB, user.ID, startsWith)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) { //TODO check global exercise list if no exercises are found
			// If no sets are found, return an empty list
			c.JSON(404, gin.H{"exercise_names": []string{}})
			return
		}
		c.JSON(500, gin.H{"error": "failed to retrieve sets"})
		return
	}

	// Extract unique exercise names from the fetched sets
	exerciseNames := make(map[uint]bool)
	for _, set := range fetchedSets {
		exerciseNames[set.ExerciseID] = true
	}

	var uniqueExerciseNames []string
	for exerciseID := range exerciseNames {
		exercise, err := exercise.GetByID(db.DB, exerciseID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				continue // Skip if the exercise is not found
			}
			c.JSON(500, gin.H{"error": "failed to retrieve exercise"})
			return
		}
		uniqueExerciseNames = append(uniqueExerciseNames, exercise.Name)
	}
	c.JSON(200, gin.H{"exerciseNames": uniqueExerciseNames})
}
