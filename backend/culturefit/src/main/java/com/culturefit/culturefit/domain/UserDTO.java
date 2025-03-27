package com.culturefit.culturefit.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDTO {
    @Column(nullable = false) // Evita valores nulos en la BD
    @NotEmpty(message = "El nombre no puede estar vacío")
    private String name;

    @Column(nullable = false, unique = true) // Evita duplicados
    @Email(message = "El correo electrónico debe ser válido")
    private String email;

    @NotEmpty(message = "El correo electrónico debe ser válido")
    private String password;

    @NotNull
    private LocalDate birthDate;
}
