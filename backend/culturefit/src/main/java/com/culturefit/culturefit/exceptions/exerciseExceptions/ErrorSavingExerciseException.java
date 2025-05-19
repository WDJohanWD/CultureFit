package com.culturefit.culturefit.exceptions.exerciseExceptions;

public class ErrorSavingExerciseException extends RuntimeException {
    public ErrorSavingExerciseException(){
        super("Cannot save exercise");
    }
}
