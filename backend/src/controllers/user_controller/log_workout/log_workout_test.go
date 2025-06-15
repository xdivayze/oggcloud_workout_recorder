package log_workout_test

import (
	"backend/src/controllers/user_controller/log_workout"
	"backend/src/db"
	"backend/src/middleware"
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/repetition"
	"backend/src/models/workout/session"
	"backend/src/models/workout/set"
	"bytes"
	"encoding/json"
	"fmt"
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

	require.Nil(db.DB.Model(testSession).Association("Sets").Append(&set.Set{
		ID:           uint(setID),
		ExerciseID:   testExercise.ID,
		SessionID:    testSession.ID,
		ExerciseName: testExercise.Name,
		UserID:       testUser.ID,
		Reps: []repetition.Repetition{
			{
				ExerciseID:       testExercise.ID,
				SetID:            uint(setID),
				Weight:           100,
				Unit:             "kg",
				RepPositionInSet: 1,
			},
		},
		SetNumber: 1,
	}))
	router := gin.Default()
	router.Use(middleware.AuthMiddleware()) // Use the auth middleware
	router.POST("/log-workout", func(c *gin.Context) {
		log_workout.HandleLogWorkout(c)
	})

	logWorkoutRequest := log_workout.NewLogWorkoutRequest([]log_workout.SetRequest{
		log_workout.NewSetRequest(1, 6, "bench press", 100, "kg"),
		log_workout.NewSetRequest(1, 5, "bench press", 75, "kg"),
		log_workout.NewSetRequest(2, 5, "bench press", 105, "kg"),
		log_workout.NewSetRequest(2, 3, "bench press", 80, "kg"),
	}, now)

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

	retrievedSession, err := session.GetByUserIDAndDate(db.DB, testUser.ID, logWorkoutRequest.Date)
	require.Nil(err, "Error retrieving session by user ID and date")
	require.NotNil(retrievedSession, "Retrieved session should not be nil")
	require.Equal(logWorkoutRequest.Date.Unix(), retrievedSession.Date.Unix(), "Retrieved session date should match the request date")

	require.Equal(testUser.ID, retrievedSession.UserID, "Retrieved session user ID should match the test user ID")
	require.Nil(db.DB.Model(retrievedSession).Association("Sets").Find(&retrievedSession.Sets))
	require.Len(retrievedSession.Sets, 2, "Retrieved session should have 4 sets")

	for _, set := range retrievedSession.Sets {
		db.DB.Model(set).Association("Reps").Find(&set.Reps)
		require.NotEmpty(set.Reps, "Set should have repetitions")
		for _, rep := range set.Reps {
			require.NotEmpty(rep.Weight, "Repetition weight should not be empty")
			require.NotEmpty(rep.Unit, "Repetition unit should not be empty")
		}
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

	logWorkoutRequest := log_workout.NewLogWorkoutRequest([]log_workout.SetRequest{
		log_workout.NewSetRequest(1, 6, "bench press", 100, "kg"),
		log_workout.NewSetRequest(1, 5, "bench press", 75, "kg"),
		log_workout.NewSetRequest(2, 5, "bench press", 105, "kg"),
		log_workout.NewSetRequest(2, 3, "bench press", 80, "kg"),
	}, time.Now())

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

	retrievedSession, err := session.GetByUserIDAndDate(db.DB, testUser.ID, logWorkoutRequest.Date)
	require.Nil(err, "Error retrieving session by user ID and date")
	require.NotNil(retrievedSession, "Retrieved session should not be nil")
	require.Equal(logWorkoutRequest.Date.Unix(), retrievedSession.Date.Unix(), "Retrieved session date should match the request date")

	require.Equal(testUser.ID, retrievedSession.UserID, "Retrieved session user ID should match the test user ID")
	require.Nil(db.DB.Model(retrievedSession).Association("Sets").Find(&retrievedSession.Sets))
	require.Len(retrievedSession.Sets, 2, "Retrieved session should have 4 sets")

	for _, set := range retrievedSession.Sets {
		db.DB.Model(set).Association("Reps").Find(&set.Reps)
		require.NotEmpty(set.Reps, "Set should have repetitions")
		for _, rep := range set.Reps {
			require.NotEmpty(rep.Weight, "Repetition weight should not be empty")
			require.NotEmpty(rep.Unit, "Repetition unit should not be empty")
		}
	}

}
