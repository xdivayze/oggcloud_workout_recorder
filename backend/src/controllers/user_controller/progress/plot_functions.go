package progress

import (
	"backend/src/models/workout/session"
	"backend/src/models/workout/set"


	"github.com/xdivayze/oggcloud_workout_plotter/intraset_heatmap"

)

func generatePlotData(sessions []session.Session, exerciseID uint) intraset_heatmap.Sessioner {
	// This function generates the plot data for the given sessions and exercise ID.
	// It returns an intraset_heatmap.Sessioner which can be used to generate a plot.
	var modelSessions []*intraset_heatmap.Session
	for _, s := range sessions {
		tidiedSession := tidySessionKeepOnlySameExercise(s, exerciseID)
		if len(tidiedSession.Sets) == 0 {
			continue // Skip sessions with no sets for the specified exercise
		}
		tidiedSets := generateModelAppropriateSetSlice(tidiedSession, exerciseID)
		modelSessions = append(modelSessions, intraset_heatmap.NewSession(tidiedSets,
			tidiedSession.Date))

	}
	return intraset_heatmap.Sessions(modelSessions)
}

func generateModelAppropriateSetSlice(tidiedSession session.Session, exerciseID uint) []*intraset_heatmap.Set {
	// This function generates a slice of intraset_heatmap.Set from the model's set data.
	// It returns a slice of intraset_heatmap.Set
	var sets []*intraset_heatmap.Set
	for _, set := range tidiedSession.Sets {
		if len(set.Reps) == 0 {
			continue // Skip sets with no repetitions
		}
		reps := generateModelAppropriateRepSlice(set, exerciseID)
		sets = append(sets, &intraset_heatmap.Set{
			SetNo: int(set.SetNumber),
			Reps:  reps,
		})

	}
	return sets

}

func generateModelAppropriateRepSlice(set set.Set, exerciseID uint) []*intraset_heatmap.Rep {
	// This function extracts the repetitions for the specified exercise from the set.
	// It returns a slice of intraset_heatmap.Rep.
	var reps []*intraset_heatmap.Rep
	for _, rep := range set.Reps {
		if rep.ExerciseID != exerciseID {
			continue // Skip repetitions that are not for the specified exercise
		}
		reps = append(reps, intraset_heatmap.NewRep(float64(rep.Weight),
			rep.RepPositionInSet))

	}
	return reps

}

func tidySessionKeepOnlySameExercise(session session.Session, exerciseID uint) session.Session {
	// This function tidies the session by keeping only the same-exercise reps while
	//preserving the session structure
	var preservedSets []set.Set
	for _, set := range session.Sets {
		if len(set.Reps) == 0 {
			continue // Skip sets with no repetitions
		}
		if set.ExerciseID != exerciseID {
			continue
		}
		// If the set has repetitions, we keep it
		preservedSets = append(preservedSets, set)

	}
	session.Sets = preservedSets
	return session

}
