package com.culturefit.culturefit.domains;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Table(name = "users")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // Evita valores nulos en la BD
    @NotEmpty(message = "The name cannot be empty")
    private String name;

    @Column(nullable = false, unique = true) // Evita duplicados
    @Email(message = "The email must be valid")
    private String email;

    @Column(nullable = false)
    private String password;

    @NotNull
    private LocalDate birthDate;

    private String imageUrl;

    @Column(nullable = false)
    private Role role;
}
