package com.culturefit.culturefit.exceptions.workoutExceptions;

public class ErrorSavingWorkoutException extends RuntimeException {
    public ErrorSavingWorkoutException(){
        super("Cannot save workout");
    }
}
