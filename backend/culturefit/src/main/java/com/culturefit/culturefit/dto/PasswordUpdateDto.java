package com.culturefit.culturefit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordUpdateDto {
    @NotBlank(message = "Current password must not be empty")
    private String currentPassword;
    
    @NotBlank(message = "New password must not be empty")
    private String newPassword;
}
