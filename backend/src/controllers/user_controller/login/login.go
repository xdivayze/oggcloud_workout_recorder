package login

import (
	"backend/src/db"
	"backend/src/models/auth_code"
	"backend/src/models/user"
	"errors"

	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LoginRequest struct {
	LoginID  string `json:"loginID" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func HandleLogin(c *gin.Context) {
	var jsonData LoginRequest
	if err := c.ShouldBindJSON(&jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	userModel := user.User{}
	if err := db.DB.Where("login_id = ?", jsonData.LoginID).First(&userModel).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) { // create user if not found

			err := handleUserNotFound(&userModel, jsonData.LoginID, jsonData.Password, db.DB)
			if err != nil {

				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		} else
		//return if any other error occurs
		{
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving user"})
			return
		}
	}
	if err := checkPassword(userModel.BCryptPassword, jsonData.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	authCode, err := appendAuthCodeToUser(&userModel, db.DB) // generate and append auth code to user

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error appending auth code to user"})
		return
	}

	// Save the user with the new auth code
	if err := userModel.Save(db.DB); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving user with new auth code"})
		return
	}

	c.Writer.Header().Set(auth_code.AUTH_CODE_FIELDNAME, authCode) // set auth code in header

	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})

}
