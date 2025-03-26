package com.culturefit.culturefit.exception.userExceptions;

public class ErrorSavingUserException extends RuntimeException {
    public ErrorSavingUserException(){
        super("Cannot save user");
    }
}
