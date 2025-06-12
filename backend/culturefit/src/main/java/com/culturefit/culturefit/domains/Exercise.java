package com.culturefit.culturefit.domains;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Schema(description = "Ejercicio del sistema")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del ejercicio", example = "1")
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    @Schema(description = "Nombre del ejercicio en español", example = "Sentadillas")
    private String nameES;

    @NotBlank
    @Column(nullable = false, unique = true)
    @Schema(description = "Nombre del ejercicio en inglés", example = "Squats")
    private String nameEN;

    @Schema(description = "URL de la imagen del ejercicio", example = "https://example.com/squats.jpg")
    private String imageUrl;
}
