package com.culturefit.culturefit.domains;

import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Schema(description = "Punto de progreso del usuario")
public class ProgressPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del punto de progreso", example = "1")
    private Long id;

    @Min(value = 1)
    @Schema(description = "Peso utilizado en el ejercicio (kg)", example = "80.5")
    private double weight;

    @Min(value = 1)
    @Schema(description = "Número de repeticiones realizadas", example = "12")
    private Integer repetitions;

    @Schema(description = "Fecha del registro de progreso", example = "2024-03-20")
    private LocalDate date;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "Usuario asociado al punto de progreso")
    private User user;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "Ejercicio asociado al punto de progreso")
    private Exercise exercise;
}
