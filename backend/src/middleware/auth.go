package middleware

import (
	"net/http"

	"backend/src/db"
	"backend/src/models/auth_code"
	"backend/src/models/user"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the authorization header
		authHeader := c.GetHeader(user.AuthCodeKey)
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		loginIDHeader := c.GetHeader(user.LoginIDKey)

		if loginIDHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Login ID header is required"})
			c.Abort()
			return
		}

		// Check if the user exists
		userModel, err := user.GetByLoginID(db.DB, loginIDHeader)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		authCode, err := auth_code.GetUserAuthCode(db.DB, userModel.ID, authHeader)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization code"})
			c.Abort()
			return
		}

		if authCode.HasExpired() {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization code has expired"})
			c.Abort()
			return
		}

		c.Set("user", userModel)
		c.Next()
	}
}
