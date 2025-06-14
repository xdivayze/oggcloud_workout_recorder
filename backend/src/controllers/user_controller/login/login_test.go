package login_test

import (
	"backend/src/controllers/user_controller/login"
	"backend/src/db"
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestLoginUserNotFound(t *testing.T) {

	require := require.New(t)

	//Initialize test database
	require.Nil(db.TestDB(), "Failed to create require instance")
	defer db.DB.Migrator().DropTable(&user.User{}, &auth_code.AuthCode{})

	loginID := "nonexistent_user"
	password := "some_password"
	// Simulate a login attempt with a non-existent user

	router := gin.Default()
	router.POST("/login", func(c *gin.Context) {
		login.HandleLogin(c)
	})

	body, err := json.Marshal(map[string]string{
		user.LoginIDKey:  loginID,
		user.PasswordKey: password,
	})
	require.Nil(err, "Error marshalling request body")

	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	require.Equal(200, resp.Code, "Expected status code 200 for user not found")

	//check authCode in header
	require.NotEmpty(resp.Header().Get(auth_code.AUTH_CODE_FIELDNAME), "Expected auth code to be present in response header")

}

func TestLoginUserFound(t *testing.T) {

	require := require.New(t)

	//Initialize test database
	require.Nil(db.TestDB(), "Failed to create require instance")
	defer db.DB.Migrator().DropTable(&user.User{}, &auth_code.AuthCode{})

	loginID := "test_user"
	password := "test_password"

	// Create a user in the database
	hashedPassword, err := login.HashPassword(password)
	require.Nil(err, "Error hashing password")
	testUser := user.User{
		LoginID:        loginID,
		BCryptPassword: hashedPassword,
	}
	require.Nil(db.DB.Create(&testUser).Error, "Failed to create test user")

	router := gin.Default()
	router.POST("/login", func(c *gin.Context) {
		login.HandleLogin(c)
	})

	body, err := json.Marshal(map[string]string{
		user.LoginIDKey:  loginID,
		user.PasswordKey: password,
	})
	require.Nil(err, "Error marshalling request body")

	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	require.Equal(200, resp.Code, "Expected status code 200 for successful login")

	//check authCode in header
	require.NotEmpty(resp.Header().Get(auth_code.AUTH_CODE_FIELDNAME), "Expected auth code to be present in response header")
	require.NotEmpty(resp.Header().Get(auth_code.EXPIRES_AT_FIELDNAME), "Expected expires at to be present in response header")

}
