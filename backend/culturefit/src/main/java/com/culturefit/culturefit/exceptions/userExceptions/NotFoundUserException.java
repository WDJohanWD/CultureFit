package com.culturefit.culturefit.exceptions.userExceptions;

public class NotFoundUserException extends RuntimeException {
    
    public NotFoundUserException(){
        super("User not found");
    }
}
