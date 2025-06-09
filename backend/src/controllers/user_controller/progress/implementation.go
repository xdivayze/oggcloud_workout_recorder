package progress

import (
	"backend/src/models/workout/partial_summary"
	"backend/src/models/workout/workout"
	"bytes"
	"errors"
	"fmt"
	"time"

	"github.com/xdivayze/oggcloud_workout_plotter/intraset_heatmap"
	"gonum.org/v1/plot"
	"gorm.io/gorm"
)

func handleGenerateProgressPlot(w *workout.Workout, db *gorm.DB) (bytes.Buffer, error) {
	//This function generates a plot of the user's progress for a specific exercise.
	//It returns a bytes.Buffer containing the image/png data of the plot.

	psums, err := partial_summary.GetByWorkoutIDAndUserID(db, w.ID, w.UserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return bytes.Buffer{}, fmt.Errorf("no partial summaries found for workout %d and user %d: %w", w.ID, w.UserID, err)
		} else {
			return bytes.Buffer{}, fmt.Errorf("failed to get partial summaries: %w", err)
		}

	}
	if len(psums) == 0 {
		return bytes.Buffer{}, fmt.Errorf("psums has no children") // Return an empty buffer if there are no partial summaries
	}

	

}

func drawPlot(pSums []*partial_summary.PartialSummary, exerciseName string) *plot.Plot {
	p := plot.New()
	p.Title.Text = fmt.Sprintf("Progress for %s", exerciseName)
	p.X.Label.Text = "Date"
	p.Y.Label.Text = "Nth Repetition"

	var date time.Time
	var sets []*intraset_heatmap.Set
	var sessions []*intraset_heatmap.Session
	var currentSession *intraset_heatmap.Session
	for _, ps := range pSums {
		if ps.CreatedAt != date {
			sessions = append(sessions, currentSession)
			date = ps.CreatedAt
			currentSession = intraset_heatmap.NewSession(sets, date)
			sets = []*intraset_heatmap.Set{}
		}
		
		

	}
}
