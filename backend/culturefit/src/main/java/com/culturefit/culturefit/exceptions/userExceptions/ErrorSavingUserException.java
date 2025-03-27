package com.culturefit.culturefit.exceptions.userExceptions;

public class ErrorSavingUserException extends RuntimeException {
    public ErrorSavingUserException(){
        super("Cannot save user");
    }
}
