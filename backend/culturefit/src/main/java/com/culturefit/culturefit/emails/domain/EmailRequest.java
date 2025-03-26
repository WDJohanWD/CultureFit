package com.culturefit.culturefit.emails.domain;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class EmailRequest {
    
    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "El asunto no puede estar vacío")
    private String subject;

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String textMessage;

}