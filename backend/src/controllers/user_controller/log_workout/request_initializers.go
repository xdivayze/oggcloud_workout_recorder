package log_workout

import "time"

func NewSetRequest(setNo, repCount int, exerciseName string, weight int, unit string) SetRequest {
	return SetRequest{
		SetNo:        setNo,
		RepCount:     repCount,
		ExerciseName: exerciseName,
		Weight:       weight,
		Unit:         unit,}
}

func NewLogWorkoutRequest(partialSummaries []SetRequest, date time.Time) LogWorkoutRequest {
	return LogWorkoutRequest{
		Sets: partialSummaries,
		Date:             date,

	}
}

type SetRequest struct {
	SetNo        int
	RepCount     int
	ExerciseName string
	Weight       int
	Unit         string
}

type LogWorkoutRequest struct {
	Sets 		   []SetRequest `json:"sets" binding:"required"` // List of sets, required field
	Date             time.Time    `json:"date" binding:"required"`             // Date of the workout, required field
}
