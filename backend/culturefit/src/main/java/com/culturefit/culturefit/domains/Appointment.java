package com.culturefit.culturefit.domains;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Schema(description = "Cita del usuario")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único de la cita", example = "1")
    private Long id;

    @Schema(description = "Fecha de la cita", example = "2024-03-20")
    private LocalDate date;

    @Schema(description = "Hora de la cita", example = "14:30")
    private LocalTime time;

    @ManyToOne(fetch = FetchType.EAGER)  // Change from LAZY to EAGER
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "Usuario asociado a la cita")
    private User user;

    @Schema(description = "Notas adicionales de la cita", example = "Traer ropa deportiva")
    private String note;

    @Schema(description = "Tipo de cita", example = "TRAINING")
    private AppointmentEnum appointmentType;

    @Schema(description = "Indica si la cita ha sido cancelada", example = "false")
    private boolean isCanceled = false;
}
