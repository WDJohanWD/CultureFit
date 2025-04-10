
package com.culturefit.culturefit.exceptions.progressPointExceptions;

public class NotFoundProgressPointException extends RuntimeException {
    
    public NotFoundProgressPointException(){
        super("Progress point not found");
    }
}
