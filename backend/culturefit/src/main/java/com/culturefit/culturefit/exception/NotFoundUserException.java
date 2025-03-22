package com.culturefit.culturefit.exception;

public class NotFoundUserException  extends RuntimeException {
    
    public NotFoundUserException(){
        super("User not found");
    }
}
