package progress_test

import (
	"backend/src/controllers/user_controller/progress"
	"backend/src/db"
	"backend/src/middleware"
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/repetition"
	"backend/src/models/workout/session"
	"backend/src/models/workout/set"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

//unit tests for the progress package

func TestHandleGenerateProgressShouldSucceed(t *testing.T) {
	// This test will check if the progress plot is generated successfully
	// with valid parameters and returns a non-nil bytes.Buffer.
	require := require.New(t)

	//Initialize test database
	require.Nil(db.TestDB(), "Failed to create require instance")
	defer db.DB.Migrator().DropTable(db.TABLES...)

	// Create a user

	testUser, err := db.CreateTestUser("test_user", "test_password")
	require.Nil(err, "Failed to create test user")
	require.NotNil(testUser, "Test user should not be nil")

	// Append an auth code to the user
	db.DB.Model(testUser).Association("AuthCodes").Append(&auth_code.AuthCode{
		Code:      "test_auth_code",
		ExpiresAt: time.Now().Add(auth_code.CODE_VALIDATION_LENGTH_MIN * time.Minute),
	})

	now := time.Now()

	//create an exercise
	testExercise := &exercise.Exercise{
		Name: "bench press",
	}
	require.Nil(db.DB.Create(testExercise).Error, "Failed to create test exercise")

	//create a session for the user
	testSession := &session.Session{
		UserID: testUser.ID,
		Date:   now}
	require.Nil(db.DB.Create(testSession).Error, "Failed to create test session")

	// Append sets to the session
	setID := 5

	testRep := repetition.Repetition{
				ExerciseID:       testExercise.ID,
				SetID:            uint(setID),
				Weight:           100,
				Unit:             "kg",
				RepPositionInSet: 1,
			
		}
	
	testSet := &set.Set{
		ID:         uint(setID),
		ExerciseID: testExercise.ID,
		SessionID:  testSession.ID,
		SetNumber: 1,
	}
	require.Nil(db.DB.Model(testSession).Association("Sets").Append(testSet))
	require.Nil(db.DB.Model(testSet).Association("Reps").Append(&testRep), "Failed to append repetitions to the set")

	router := gin.Default()
	router.Use(middleware.AuthMiddleware()) // Use the auth middleware

	router.GET("/progress", func(c *gin.Context) {
		progress.HandleGetProgress(c)
	})

	req := httptest.NewRequest("GET", "/progress?exercise_name=bench%20press&start_time=2025-06-08&end_time=2025-06-15", nil)
	req.Header.Set(auth_code.AUTH_CODE_FIELDNAME, "test_auth_code") // Set the auth code in the header
	req.Header.Set(user.LoginIDKey, testUser.LoginID)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	require.Equal(200, resp.Code, "Expected status code 200, got %d", resp.Code)
	require.NotNil(resp.Body, "Response body should not be nil")
	require.Greater(resp.Body.Len(), 0, "Response body should not be empty")
	require.Equal("image/png", resp.Header().Get("Content-Type"), "Expected Content-Type to be image/png, got %s", resp.Header().Get("Content-Type"))
	require.NotEmpty(resp.Body.Bytes(), "Response body should not be empty")

	//save the response body to a file for manual inspection if needed

	require.Nil(os.WriteFile("progress_plot.png", resp.Body.Bytes(), 0644), "Failed to write response body to file")
	require.FileExists("progress_plot.png", "Progress plot file should exist")

}
