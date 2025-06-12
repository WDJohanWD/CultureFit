package com.culturefit.culturefit.domains;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Schema(description = "Entrenamiento del usuario")
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del entrenamiento", example = "1")
    private Long id;

    @Min(value = 1)
    @Max(value = 7)
    @Schema(description = "Número del día de la semana (1-7)", example = "1")
    private Integer dayNumber;

    @Min(value = 1)
    @Schema(description = "Número de series del ejercicio", example = "3")
    private Integer sets;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "Usuario asociado al entrenamiento")
    private User user;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Schema(description = "Ejercicio asociado al entrenamiento")
    private Exercise exercise;

    @Schema(description = "Orden del ejercicio en la secuencia", example = "1")
    private Integer workoutOrder;
}
