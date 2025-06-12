package com.culturefit.culturefit.dto;

import lombok.Data;

@Data
public class ResetPasswordDto {
    private String password; 
    private String token;
}
