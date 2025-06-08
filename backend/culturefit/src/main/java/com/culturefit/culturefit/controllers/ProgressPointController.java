package com.culturefit.culturefit.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.ProgressPoint;
import com.culturefit.culturefit.dto.ProgressPointDto;
import com.culturefit.culturefit.services.progressPointService.ProgressPointService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Controlador de puntos de progreso", description = "Controlador para gestionar los puntos de progreso de un usuario en un ejercicio.")
@RestController
@Validated
public class ProgressPointController {
    @Autowired
    ProgressPointService progressPointService;

    // Getters

    @Operation(summary = "Obtener un punto de progreso por ID", description = "Devuelve los datos de un punto de progreso por su ID.")
    @Parameter(name = "id", description = "Id del punto de progreso", required = true)
    @GetMapping("/progress-point/{id}")
    public ResponseEntity<ProgressPoint> getProgressPoint(@PathVariable Long id) {
        ProgressPoint progressPoint = progressPointService.getProgressPoint(id);
        return ResponseEntity.ok(progressPoint);
    }

    @Operation(summary = "Obtener puntos de progreso de un usuario en un ejercicio", description = "Devuelve una lista de puntos de progreso para un usuario en un ejercicio específico.")
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @Parameter(name = "exerciseId", description = "Id del ejercicio", required = true)
    @GetMapping("/user-progress/{userId}/{exerciseId}")
    public List<ProgressPoint> getUserProgress(@PathVariable Long userId, @PathVariable Long exerciseId) {
        List<ProgressPoint> progressPoints = progressPointService.getProgressPointFromUser(userId, exerciseId);
        return progressPoints;
    }

    // Recibir el último punto de progresion de un usuario(userId) en un ejercicio
    // en concreto(exerciseId)
    @Operation(summary = "Obtener el último punto de progreso de un usuario en un ejercicio", description = "Devuelve el último punto de progreso registrado por un usuario en un ejercicio específico.")
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @Parameter(name = "exerciseId", description = "Id del ejercicio", required = true)
    @GetMapping("/user-latest/{userId}/{exerciseId}")
    public ResponseEntity<ProgressPoint> getUserLatest(@PathVariable Long userId, @PathVariable Long exerciseId) {
        ProgressPoint progressPoint = progressPointService.getLatestFromUser(userId, exerciseId);
        return ResponseEntity.ok(progressPoint);
    }

    // Posts
    @Operation(summary = "Crear un nuevo punto de progreso", description = "Crea un nuevo punto de progreso para un usuario en un ejercicio.")
    @PostMapping("/new-progress-point")
    public ProgressPoint newProgressPoint(@Valid @RequestBody ProgressPointDto progressPointDto) {
        ProgressPoint progressPoint = progressPointService.convertToClass(progressPointDto);
        ProgressPoint savedProgressPoint = progressPointService.saveProgressPoint(progressPoint);
        return savedProgressPoint;
    }

    // Delete
    @Operation(summary = "Eliminar un punto de progreso", description = "Elimina un punto de progreso por su ID.")
    @DeleteMapping("/delete-progress-point/{id}")
    public boolean deleteProgressPoint(@PathVariable Long id) {
        return progressPointService.deleteProgressPoint(id);
    }

    // Put
    @Operation(summary = "Editar un punto de progreso", description = "Actualiza los datos de un punto de progreso existente.")
    @PutMapping("/edit-progress-point/{id}")
    public ResponseEntity<ProgressPoint> editProgressPoint(@PathVariable Long id,
            @Valid @RequestBody ProgressPointDto progressPointDto) {
        ProgressPoint progressPoint = progressPointService.convertToClass(progressPointDto);
        progressPoint.setId(id);
        ProgressPoint updatedProgressPoint = progressPointService.updateProgressPoint(progressPoint);
        return ResponseEntity.ok(updatedProgressPoint);
    }
}
