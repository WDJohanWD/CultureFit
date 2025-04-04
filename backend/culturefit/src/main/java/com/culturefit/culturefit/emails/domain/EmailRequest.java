package com.culturefit.culturefit.emails.domain;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {
    
    @NotBlank(message = "The email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "The subject cannot be empty")
    private String subject;

    @NotBlank(message = "The message cannot be empty")
    private String textMessage;
}