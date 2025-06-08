package log_workout

func NewPartialSummaryRequest(setNo, repCount int, exerciseName string, weight int, unit string) PartialSummaryRequest {
	return PartialSummaryRequest{
		SetNo:        setNo,
		RepCount:     repCount,
		ExerciseName: exerciseName,
		Weight:       weight,
		Unit:         unit,
	}
}

func NewLogWorkoutRequest(partialSummaries []PartialSummaryRequest) LogWorkoutRequest {
	return LogWorkoutRequest{
		PartialSummaries: partialSummaries,
	}
}

type PartialSummaryRequest struct {
	SetNo        int
	RepCount     int
	ExerciseName string
	Weight       int
	Unit         string
}

type LogWorkoutRequest struct {
	PartialSummaries []PartialSummaryRequest `json:"partialSummaries" binding:"required"` // Assuming this is the correct field name
}
