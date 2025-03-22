package com.culturefit.culturefit.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
@Table(name = "usuarios")
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) // Evita valores nulos en la BD
    @NotEmpty(message = "El nombre no puede estar vacío")
    private String nombre;

    @Column(nullable = false, unique = true) // Evita duplicados
    @Email(message = "El correo electrónico debe ser válido")
    private String email;

    private LocalDate fechaNacimiento;
}
