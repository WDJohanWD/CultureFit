package com.culturefit.culturefit.exceptions.progressPointExceptions;

public class ErrorSavingProgressPointException extends RuntimeException {
    public ErrorSavingProgressPointException(){
        super("Cannot save progress point");
    }
}
