package com.culturefit.culturefit.domains;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Size(min = 3, max = 20)
    @NotBlank
    private String name;

    @Column(nullable = false, unique = true)
    @Size(max = 50)
    @Email(message = "The email must be valid")
    @NotBlank
    private String email;

    @Column(nullable = false)
    @Size(min = 6, max = 40)
    @NotBlank(message = "El correo electrónico debe ser válido")
    private String password;

    @NotNull
    private LocalDate birthDate;

    private boolean active = false;

    private String imageUrl;

    @Column(nullable = false)
    private Role role;

    @Column( unique = true)
    private String dni;

    private Long appointmentsAvailables = 0L;
}
