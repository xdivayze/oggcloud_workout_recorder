package exercise


//This struct represents an exercise in the workout system.
//Independent of any user or workout, it is used as a foreign key in the workout model.
//It can be used to store metadata about the exercise, such as its name, max and min weights in the database
//max and min weights should be calculated keeping in mind statistical outliers
type Exercise struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"not null;unique"` // Unique name for the exercise
	MaxWeight   int    `json:"max_weight" gorm:"not null"` // Maximum weight for the exercise
	MinWeight   int    `json:"min_weight" gorm:"not null"` // Minimum weight for the exercise
}

var EXERCISE_NAME_QUERY_PARAM = "exercise_name"