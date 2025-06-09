package progress

import (
	"backend/src/models/workout/session"
	"bytes"
	"errors"
	"fmt"
	"time"

	"image/color"
	"image/png"

	"github.com/xdivayze/oggcloud_workout_plotter/intraset_heatmap"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/vg"
	"gonum.org/v1/plot/vg/draw"
	"gonum.org/v1/plot/vg/vgimg"
)

func handleGenerateProgressPlot(yPadding vg.Length, startTime time.Time, endTime time.Time,
	maxIntensity, minIntensity float64, columnWidth,
	minHeight, maxHeight vg.Length,
	colorSetterFunction func(intensity float64) color.Color,
	sessions []session.Session, exerciseID uint, exerciseName string) (*bytes.Buffer, error) {

	//This function generates a plot of the user's progress for a specific exercise.
	//It returns a bytes.Buffer containing the image/png data of the plot.

	var buf bytes.Buffer
	if exerciseID == 0 {
		return &buf, errors.New("exercise ID is required")
	}

	data := generatePlotData(sessions, exerciseID)
	if data == nil {
		return &buf, errors.New("no data available for the specified exercise")
	}

	heatmap := intraset_heatmap.NewIntrasetHeatmap(
		data,
		maxIntensity,
		minIntensity,
		columnWidth,
		minHeight,
		maxHeight,
		colorSetterFunction,
	)


	p := plot.New()
	p.Title.Text = fmt.Sprintf("Progress Plot for Exercise: %s ", exerciseName)
	p.X.Label.Text = "Session Date"
	p.Y.Label.Text = "Rep Number"

	p.Add(heatmap)
	start := startTime.Truncate(24 * time.Hour)
	end := endTime.Truncate(24 * time.Hour)

	p.Y.Padding = yPadding

	p.X.Tick.Marker = plot.TickerFunc(heatmap.GenerateXTickers)

	p.X.Min = float64(start.Unix())
	p.X.Max = float64(end.Unix())
	p.Y.Min = 0
	p.Y.Max = float64(heatmap.MaxReps + 3)

	img := vgimg.New(500, 500)
	dc := draw.New(img)
	p.Draw(dc)

	if err := png.Encode(&buf, img.Image()); err != nil {
		return &buf, fmt.Errorf("error occurred while encoding png to buffer:\n\t%w\n", err)
	}
	return &buf, nil

}
