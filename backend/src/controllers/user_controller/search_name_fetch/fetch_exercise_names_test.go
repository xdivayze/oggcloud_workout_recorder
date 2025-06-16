package search_name_fetch_test

import (
	"backend/src/controllers/user_controller/search_name_fetch"
	"backend/src/db"
	"backend/src/middleware"
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"backend/src/models/workout/exercise"
	"backend/src/models/workout/repetition"
	"backend/src/models/workout/session"
	"backend/src/models/workout/set"
	"encoding/json"

	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestFetchExerciseOnlyExistsInGlobal(t *testing.T) {
	//This test will check if the handler can return an exercise
	// that exists only in the global exercise list, not in the user's sets.
	require := require.New(t)

	//Initialize test database
	require.Nil(db.TestDB(), "Failed to create require instance")
	defer db.DB.Migrator().DropTable(db.TABLES...)

	// Create a user

	testUser, err := db.CreateTestUser("test_user", "test_password")
	require.Nil(err, "Failed to create test user")
	require.NotNil(testUser, "Test user should not be nil")

	testUser1, err := db.CreateTestUser("test_user1", "test_password")
	require.Nil(err, "Failed to create test user1")
	require.NotNil(testUser1, "Test user1 should not be nil")

	// Append an auth code to the user
	db.DB.Model(testUser1).Association("AuthCodes").Append(&auth_code.AuthCode{
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
		Weight:           20,
		Unit:             "kg",
		RepPositionInSet: 1,
	}

	testSet := &set.Set{
		ID:           uint(setID),
		ExerciseID:   testExercise.ID,
		ExerciseName: testExercise.Name,
		UserID:       testUser.ID,
		SessionID:    testSession.ID,
		SetNumber:    1,
	}
	require.Nil(db.DB.Model(testSession).Association("Sets").Append(testSet))
	require.Nil(db.DB.Model(testSet).Association("Reps").Append(&testRep), "Failed to append repetitions to the set")

	router := gin.Default()
	router.Use(middleware.AuthMiddleware())
	router.GET("/fetch_exercise_names", func(c *gin.Context) {
		search_name_fetch.HandleFetchExerciseNames(c)
	})

	// Create a request to fetch exercise names
	url := "/fetch_exercise_names?starts_with=be"
	req := httptest.NewRequest("GET", url, nil)
	req.Header.Set(auth_code.AUTH_CODE_FIELDNAME, "test_auth_code") // Set the auth code in the header
	req.Header.Set(user.LoginIDKey, testUser1.LoginID)

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Check the response status code
	require.Equal(200, resp.Code, "Expected status code 200, got %d", resp.Code)

	var response map[string][]string
	require.Nil(json.Unmarshal(resp.Body.Bytes(), &response), "Failed to unmarshal response body")

	require.NotNil(response["exerciseNames"], "Exercise names should not be nil")
	require.Contains(response["exerciseNames"], "bench press", "Exercise names should contain 'bench press'")
}

func TestFetchExerciseNames(t *testing.T) {
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
		Weight:           20,
		Unit:             "kg",
		RepPositionInSet: 1,
	}

	testSet := &set.Set{
		ID:           uint(setID),
		ExerciseID:   testExercise.ID,
		ExerciseName: testExercise.Name,
		UserID:       testUser.ID,
		SessionID:    testSession.ID,
		SetNumber:    1,
	}
	require.Nil(db.DB.Model(testSession).Association("Sets").Append(testSet))
	require.Nil(db.DB.Model(testSet).Association("Reps").Append(&testRep), "Failed to append repetitions to the set")

	router := gin.Default()
	router.Use(middleware.AuthMiddleware())
	router.GET("/fetch_exercise_names", func(c *gin.Context) {
		search_name_fetch.HandleFetchExerciseNames(c)
	})

	// Create a request to fetch exercise names
	url := "/fetch_exercise_names?starts_with=be"
	req := httptest.NewRequest("GET", url, nil)
	req.Header.Set(auth_code.AUTH_CODE_FIELDNAME, "test_auth_code") // Set the auth code in the header
	req.Header.Set(user.LoginIDKey, testUser.LoginID)

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Check the response status code
	require.Equal(200, resp.Code, "Expected status code 200, got %d", resp.Code)

	var response map[string][]string
	require.Nil(json.Unmarshal(resp.Body.Bytes(), &response), "Failed to unmarshal response body")

	require.NotNil(response["exerciseNames"], "Exercise names should not be nil")
	require.Contains(response["exerciseNames"], "bench press", "Exercise names should contain 'bench press'")
}
