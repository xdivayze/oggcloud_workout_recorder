package log_workout

import "time"

func NewSetRequest(setNo, repCount int, exerciseName string, weight int, unit string) SetRequest {
	return SetRequest{
		SetNo:        setNo,
		RepCount:     repCount,
		ExerciseName: exerciseName,
		Weight:       weight,
		Unit:         unit}
}

func NewLogWorkoutRequest(sets []SetRequest, date time.Time) LogWorkoutRequest {
	return LogWorkoutRequest{
		Sets: sets,
		Date: date,
	}
}

type SetRequest struct {
	SetNo        int    `json:"setNo" binding:"required"`        // Set number, required field
	RepCount     int    `json:"repCount" binding:"required"`     // Number of repetitions, required field
	ExerciseName string `json:"exerciseName" binding:"required"` // Name of the exercise, required field
	Weight       int    `json:"weight" binding:"required"`       // Weight used in the set, required field
	Unit         string `json:"unit" binding:"required"`         // Unit of weight (e.g., kg, lbs), required field
}

type LogWorkoutRequest struct {
	Sets []SetRequest `json:"sets" binding:"required"` // List of sets, required field
	Date time.Time    `json:"date" binding:"required"` // Date of the workout, required field
}
