package auth_code

import "time"

func (a *AuthCode) HasExpired() bool {
	if a.ExpiresAt.Compare(time.Now()) == -1 {
		return true
	}
	return false
}
