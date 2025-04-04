package com.culturefit.culturefit.exceptions.profileImageExceptions;

public class ErrorSavingImageException extends RuntimeException{
    public ErrorSavingImageException(){
        super("Cannot save the image");
    }
}
