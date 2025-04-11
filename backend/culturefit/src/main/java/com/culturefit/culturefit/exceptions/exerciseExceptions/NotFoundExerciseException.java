
package com.culturefit.culturefit.exceptions.exerciseExceptions;

public class NotFoundExerciseException extends RuntimeException {
    
    public NotFoundExerciseException(){
        super("Exercise not found");
    }
}
