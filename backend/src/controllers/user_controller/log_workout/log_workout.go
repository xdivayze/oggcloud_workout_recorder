package log_workout

import (
	"backend/src/db"
	user_model "backend/src/models/user" // Assuming user is a package that contains the User model
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/repetition"
	"backend/src/models/workout/session"
	set_module "backend/src/models/workout/set"
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
	if len(logWorkoutRequest.Sets) == 0 {
		c.JSON(400, gin.H{"error": "No workout data provided"})
		return
	}

	retrievedSession, err := session.GetByUserIDAndDate(db.DB, user.ID, logWorkoutRequest.Date)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// If the session is not found, create a new one
			newSession := &session.Session{
				UserID: user.ID,
				Date:   logWorkoutRequest.Date,
			}
			if err := newSession.Create(db.DB); err != nil {
				c.JSON(500, gin.H{"error": "Error creating new session"})
				return
			}
			retrievedSession = newSession
		} else {
			c.JSON(500, gin.H{"error": "Error retrieving session"})
			return
		}
	}

	for _, set := range logWorkoutRequest.Sets {

		retrievedExercise, err := exercise.GetByName(db.DB, set.ExerciseName)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// If the exercise is not found, create a new one
				newExercise := &exercise.Exercise{
					Name: set.ExerciseName,
				}
				if err := newExercise.Create(db.DB); err != nil {
					c.JSON(500, gin.H{"error": "Error creating new exercise"})
					return
				}
				retrievedExercise = newExercise
			} else {
				c.JSON(500, gin.H{"error": "Error retrieving exercise"})
				return
			}
		}

		foundSet, err := set_module.GetBySessionIDAndExerciseNameAndSetNumber(db.DB, retrievedSession.ID, retrievedExercise.ID, set.SetNo)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// If the set is not found, create a new one
				newSet := &set_module.Set{
					UserID:     user.ID,
					SessionID:  retrievedSession.ID,
					ExerciseID: retrievedExercise.ID,
					SetNumber:  uint(set.SetNo),
					Reps:       []repetition.Repetition{}, // Initialize with an empty slice
				}

				if err := newSet.Create(db.DB); err != nil {
					c.JSON(500, gin.H{"error": "Error creating new set"})
					return
				}
				foundSet = newSet
			} else {
				c.JSON(500, gin.H{"error": "Error retrieving set"})
				return
			}
		}
		var foundReps []*repetition.Repetition
		if err := db.DB.Model(foundSet).Association("Reps").Find(&foundReps); err != nil {
			c.JSON(500, gin.H{"error": "Error retrieving repetitions for the set"})
			return
		}
		lenRepsInSet := len(foundReps)

		// If the set is found, update it with the new data
		for i := 0; i < set.RepCount; i++ {
			db.DB.Model(&foundSet).Association("Reps").Append(&repetition.Repetition{
				Weight:           set.Weight,
				Unit:             set.Unit,
				SetID:            foundSet.ID,
				RepPositionInSet: i + lenRepsInSet, // Assuming this is the position of the repetition in the set 0 indexed
				ExerciseID:       retrievedExercise.ID,
			})

		}

	}

	c.JSON(200, gin.H{"message": "Workout logged successfully"})

}
