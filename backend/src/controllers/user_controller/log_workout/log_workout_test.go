package log_workout_test

import (
	"backend/src/controllers/user_controller/log_workout"
	"backend/src/db"
	"backend/src/middleware"
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"fmt"

	"backend/src/models/workout/workout"
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestLogWorkoutWorkoutExistsShouldSucceed(t *testing.T) {
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

	// Create a workout for the user
	testWorkout := &workout.Workout{
		UserID:       testUser.ID,
		ExerciseName: "bench press",
	}
	require.Nil(testWorkout.Create(db.DB), "Failed to create test workout")
	router := gin.Default()
	router.Use(middleware.AuthMiddleware()) // Use the auth middleware
	router.POST("/log-workout", func(c *gin.Context) {
		log_workout.HandleLogWorkout(c)
	})
	logWorkoutRequest := log_workout.NewLogWorkoutRequest([]log_workout.PartialSummaryRequest{
		log_workout.NewPartialSummaryRequest(1, 10, "bench press", 100, "kg"),
	})

	body, err := json.Marshal(logWorkoutRequest)

	require.Nil(err, "Error marshalling request body")
	req := httptest.NewRequest("POST", "/log-workout", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(auth_code.AUTH_CODE_FIELDNAME, "test_auth_code") // Set the auth code in the header
	req.Header.Set(user.LoginIDKey, testUser.LoginID)               // Set the login ID in the header

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	fmt.Printf("Response: %s\n", resp.Body.String())
	require.Equal(200, resp.Code, "Expected status code 200 for successful workout logging")

	retrievedWorkout, err := workout.GetUserWorkoutFromWorkoutNameAndUserID(db.DB, testUser.ID, "bench press")
	{ // Check if the workout was created successfully
		require.Nil(err, "Error retrieving workout partial summaries")
		require.NotNil(retrievedWorkout, "Retrieved workout should not be nil")
		require.Equal("bench press", retrievedWorkout.ExerciseName, "Expected workout name to be 'bench press'")
	}
	retrievedWorkoutPartialSummaries, err := retrievedWorkout.GetPartialSummaries(db.DB)
	{ // Check if the partial summary was logged correctly
		require.Nil(err, "Error retrieving workout partial summaries")
		require.Len(retrievedWorkoutPartialSummaries, 1, "Expected one partial summary for the logged workout")
		require.Equal(1, retrievedWorkoutPartialSummaries[0].SetNo, "Expected set number to be 1")
		require.Equal(10, retrievedWorkoutPartialSummaries[0].RepCount, "Expected rep count to be 10")
		require.Equal(100, retrievedWorkoutPartialSummaries[0].Weight, "Expected weight to be 100")
		require.Equal("kg", retrievedWorkoutPartialSummaries[0].Unit, "Expected unit to be kg")
	}

}

func TestLogWorkoutWorkoutMissingShouldSucceed(t *testing.T) {
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

	router := gin.Default()
	router.Use(middleware.AuthMiddleware()) // Use the auth middleware
	router.POST("/log-workout", func(c *gin.Context) {
		log_workout.HandleLogWorkout(c)
	})

	logWorkoutRequest := log_workout.NewLogWorkoutRequest([]log_workout.PartialSummaryRequest{
		log_workout.NewPartialSummaryRequest(1, 10, "bench press", 100, "kg"),
	})

	body, err := json.Marshal(logWorkoutRequest)

	require.Nil(err, "Error marshalling request body")
	req := httptest.NewRequest("POST", "/log-workout", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(auth_code.AUTH_CODE_FIELDNAME, "test_auth_code") // Set the auth code in the header
	req.Header.Set(user.LoginIDKey, testUser.LoginID)               // Set the login ID in the header

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	fmt.Printf("Response: %s\n", resp.Body.String())
	require.Equal(200, resp.Code, "Expected status code 200 for successful workout logging")
	retrievedWorkout, err := workout.GetUserWorkoutFromWorkoutNameAndUserID(db.DB, testUser.ID, "bench press")
	{ // Check if the workout was created successfully

		require.Nil(err, "Error retrieving workout partial summaries")
		require.NotNil(retrievedWorkout, "Retrieved workout should not be nil")
		require.Equal("bench press", retrievedWorkout.ExerciseName, "Expected workout name to be 'bench press'")
	}
	retrievedWorkoutPartialSummaries, err := retrievedWorkout.GetPartialSummaries(db.DB)
	{ // Check if the partial summary was logged correctly
		require.Nil(err, "Error retrieving workout partial summaries")
		require.Len(retrievedWorkoutPartialSummaries, 1, "Expected one partial summary for the logged workout")
		require.Equal(1, retrievedWorkoutPartialSummaries[0].SetNo, "Expected set number to be 1")
		require.Equal(10, retrievedWorkoutPartialSummaries[0].RepCount, "Expected rep count to be 10")
		require.Equal(100, retrievedWorkoutPartialSummaries[0].Weight, "Expected weight to be 100")
		require.Equal("kg", retrievedWorkoutPartialSummaries[0].Unit, "Expected unit to be kg")
	}

}

func TestLogWorkoutUserMissingShouldFail(t *testing.T) {
	require := require.New(t)

	//Initialize test database
	require.Nil(db.TestDB(), "Failed to create require instance")
	defer db.DB.Migrator().DropTable(db.TABLES...)

	router := gin.Default()
	router.Use(middleware.AuthMiddleware()) // Use the auth middleware
	router.POST("/log-workout", func(c *gin.Context) {
		log_workout.HandleLogWorkout(c)
	})

	logWorkoutRequest := log_workout.NewLogWorkoutRequest([]log_workout.PartialSummaryRequest{
		log_workout.NewPartialSummaryRequest(1, 10, "bench press", 100, "kg"),
	})

	body, err := json.Marshal(logWorkoutRequest)

	require.Nil(err, "Error marshalling request body")
	req := httptest.NewRequest("POST", "/log-workout", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(auth_code.AUTH_CODE_FIELDNAME, "test_auth_code") // Set the auth code in the header

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	fmt.Printf("Response: %s\n", resp.Body.String())
	require.Equal(401, resp.Code, "Expected status code 400 for missing user")
}
