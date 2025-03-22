package com.culturefit.culturefit.exception;

public class ErrorSavingUserException extends RuntimeException {
    public ErrorSavingUserException(){
        super("Cannot save user");
    }
}
