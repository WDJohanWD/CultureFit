package com.culturefit.culturefit.exception.userExceptions;

public class NotFoundUserException extends RuntimeException {
    
    public NotFoundUserException(){
        super("User not found");
    }
}
