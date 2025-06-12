
package com.culturefit.culturefit.exceptions.workoutExceptions;

public class NotFoundWorkoutException extends RuntimeException {
    
    public NotFoundWorkoutException(){
        super("Workout not found");
    }
}
