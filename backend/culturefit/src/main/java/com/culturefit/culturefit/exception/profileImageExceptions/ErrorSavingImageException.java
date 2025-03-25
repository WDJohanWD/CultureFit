package com.culturefit.culturefit.exception.profileImageExceptions;

public class ErrorSavingImageException extends RuntimeException{
    public ErrorSavingImageException(){
        super("Cannot save the image");
    }
}
