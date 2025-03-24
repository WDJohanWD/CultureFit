package com.culturefit.culturefit.exception.profileImageExceptions;

public class NotFoundProfileImageException extends RuntimeException{
    public NotFoundProfileImageException(){
        super("Image not found");
    }
}
