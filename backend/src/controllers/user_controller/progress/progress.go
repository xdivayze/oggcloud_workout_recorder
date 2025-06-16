package progress

import (
	"backend/src/db"
	"backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/session"
	"errors"
	"time"

	color_module "image/color"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// This function will return a graph of the user's progress
// on a specific exercise for a specific time period.
// It will return image/png data without any json data

func HandleGetProgress(c *gin.Context) {

	params := c.Request.URL.Query()
	exerciseName := params.Get(exercise.EXERCISE_NAME_QUERY_PARAM)
	startTime := params.Get("start_time")
	endTime := params.Get("end_time")

	if exerciseName == "" || startTime == "" || endTime == ""  {
		// If any parameter is missing, return a 400 Bad Request error
		c.JSON(400, gin.H{"error": "a parameter is missing"})
		return
	}
	// Define the layout for parsing the time strings
	layout := "2006-01-02 15:04:05" 
	// Parse the start and end times
	startTimeParsed, err := time.Parse(layout, startTime)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid start time format"})
		return
	}
	endTimeParsed, err := time.Parse(layout, endTime)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid end time format"})
		return
	}
	// Check if the start time is before the end time
	if startTimeParsed.After(endTimeParsed) {
		c.JSON(400, gin.H{"error": "start time must be before end time"})
		return
	}

	foundEx, err := exercise.GetByName(db.DB, exerciseName)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "exercise not found"})
			return
		}
		c.JSON(500, gin.H{"error": "failed to retrieve exercise"})
		return
	}
	userID := c.MustGet("user").(*user.User).ID
	sessions, err := session.GetAllByUserIDAndDateRange(db.DB, userID, startTimeParsed, endTimeParsed)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "no sessions found for user"})
			return
		}
		c.JSON(500, gin.H{"error": "failed to retrieve sessions"})
		return
	}
	if len(sessions) == 0 {
		c.JSON(404, gin.H{"error": "no sessions found for user"})
		return
	}
	//extract set constraints for the earliest and latest sessions
	earliestSession := sessions[0]
	latestSession := sessions[len(sessions)-1]

	colorSetterFunc := func(intensity float64) color_module.Color {
		return color_module.RGBA{
			R: 0,
			G: (255 - uint8(intensity)),
			B: 0,
			A: 255,
		}

	}

	img, err := handleGenerateProgressPlot(YPADDING, earliestSession.Date, latestSession.Date,
		float64(MAX_INTENSITY), float64(MIN_INTENSITY), COLUMN_WIDTH,
		MIN_HEIGHT, MAX_HEIGHT, colorSetterFunc, sessions, foundEx.ID, exerciseName)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to generate progress plot"})
		return
	}
	if img == nil {
		c.JSON(404, gin.H{"error": "no data found for the specified parameters"})
		return
	}
	// Set the content type to image/png and return the image data
	c.Header("Content-Type", "image/png")
	c.Data(200, "image/png", img.Bytes()) //TODO switch to multipart/form-data if needed

}
