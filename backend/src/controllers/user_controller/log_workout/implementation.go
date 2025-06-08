package log_workout

import (
	"backend/src/models/workout/partial_summary"
	"backend/src/models/workout/workout"

	"gorm.io/gorm"
)

func HandleWorkoutNotFound(workoutName string, userID uint, db *gorm.DB) (*workout.Workout, error) {
	//create a new workout with the given name
	newWorkout := &workout.Workout{
		ExerciseName: workoutName,
		UserID:       userID,
	}
	if err := newWorkout.Create(db); err != nil {
		return nil, err
	}
	return newWorkout, nil
}

func AppendPartialSummaryToWorkout(workout *workout.Workout, partialSummary *partial_summary.PartialSummary, db *gorm.DB) error {
	return db.Model(workout).Association("PartialSummaries").Append(partialSummary)
}
