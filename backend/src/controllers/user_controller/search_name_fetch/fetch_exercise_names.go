package search_name_fetch

import (
	"backend/src/db"
	"backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/repetition"
	"backend/src/models/workout/set"
	"errors"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleFetchExerciseNames(c *gin.Context) { //TODO return greatest weight lifted for the found exercise for the user
	// This function handles the request to fetch recently
	// saved sets' exercise names. for displaying in the frontend
	// search bar. It also searches for exercises globally if no sets are found.

	params := c.Request.URL.Query()
	startsWith := params.Get("starts_with") // nullable
	user := c.MustGet("user").(*user.User)  // Get the user from the context, assuming middleware sets it
	fetchedSets, err := set.GetByCreatedAtDescAndUserIDAndStartsWith(db.DB, user.ID, startsWith)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			fetchedSets = []set.Set{} // If no sets found, return an empty slice
		} else {
			c.JSON(500, gin.H{"error": "failed to retrieve sets"})
			return
		}
	}

	// Extract unique exercise names from the fetched sets
	exerciseNames := make(map[string]uint)
	for _, set := range fetchedSets {
		setReps, err := repetition.GetAllBySetIDAndWeightDesc(db.DB, set.ID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				exerciseNames[set.ExerciseName] = 0 // If no repetitions found, set weight to 0
				continue // Skip if no repetitions found for this set
			}
			c.JSON(500, gin.H{"error": "failed to retrieve repetitions"})
			return
		}
		exerciseNames[set.ExerciseName] = setReps[0].Weight // Store the greatest weight lifted for this exercise
		
	}

	// If no sets were found, search for exercises directly
	if len(exerciseNames) == 0 {
		exercises, err := exercise.GetAllByStartsWith(db.DB, startsWith)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(404, gin.H{"exerciseNames": []string{}})
				return // No exercises found, return empty list
			}
			c.JSON(500, gin.H{"error": "failed to retrieve exercises"})
			return
		}
		for _, ex := range exercises {
			exerciseNames[ex.Name] = 0 //Set weight to 0 for exercises that user has not lifted yet
		}
	}

	c.JSON(200, gin.H{"exerciseNames": exerciseNames})
}
