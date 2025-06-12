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
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Controlador de puntos de progreso", description = "Controlador para gestionar los puntos de progreso de un usuario en un ejercicio.")
@RestController
@Validated
@SecurityRequirement(name = "bearerAuth")
public class ProgressPointController {
    @Autowired
    ProgressPointService progressPointService;

    // Getters

    @Operation(summary = "Obtener un punto de progreso por ID", description = "Devuelve los datos de un punto de progreso por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Punto de progreso encontrado exitosamente",
            content = @Content(schema = @Schema(implementation = ProgressPoint.class))),
        @ApiResponse(responseCode = "404", description = "Punto de progreso no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del punto de progreso", required = true)
    @GetMapping("/progress-point/{id}")
    public ResponseEntity<ProgressPoint> getProgressPoint(@PathVariable Long id) {
        ProgressPoint progressPoint = progressPointService.getProgressPoint(id);
        return ResponseEntity.ok(progressPoint);
    }

    @Operation(summary = "Obtener puntos de progreso de un usuario en un ejercicio", description = "Devuelve una lista de puntos de progreso para un usuario en un ejercicio específico.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de puntos de progreso obtenida exitosamente",
            content = @Content(schema = @Schema(implementation = ProgressPoint.class))),
        @ApiResponse(responseCode = "404", description = "Usuario o ejercicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @Parameter(name = "exerciseId", description = "Id del ejercicio", required = true)
    @GetMapping("/user-progress/{userId}/{exerciseId}")
    public List<ProgressPoint> getUserProgress(@PathVariable Long userId, @PathVariable Long exerciseId) {
        List<ProgressPoint> progressPoints = progressPointService.getProgressPointFromUser(userId, exerciseId);
        return progressPoints;
    }

    // Posts
    @Operation(summary = "Crear un nuevo punto de progreso", description = "Crea un nuevo punto de progreso para un usuario en un ejercicio.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Punto de progreso creado exitosamente",
            content = @Content(schema = @Schema(implementation = ProgressPoint.class))),
        @ApiResponse(responseCode = "400", description = "Datos de punto de progreso inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuario o ejercicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/new-progress-point")
    public ProgressPoint newProgressPoint(@Valid @RequestBody ProgressPointDto progressPointDto) {
        ProgressPoint progressPoint = progressPointService.convertToClass(progressPointDto);
        ProgressPoint savedProgressPoint = progressPointService.saveProgressPoint(progressPoint);
        return savedProgressPoint;
    }

    // Delete
    @Operation(summary = "Eliminar un punto de progreso", description = "Elimina un punto de progreso por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Punto de progreso eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Punto de progreso no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/delete-progress-point/{id}")
    public boolean deleteProgressPoint(@PathVariable Long id) {
        return progressPointService.deleteProgressPoint(id);
    }

    // Put
    @Operation(summary = "Editar un punto de progreso", description = "Actualiza los datos de un punto de progreso existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Punto de progreso actualizado exitosamente",
            content = @Content(schema = @Schema(implementation = ProgressPoint.class))),
        @ApiResponse(responseCode = "404", description = "Punto de progreso no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de punto de progreso inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping("/edit-progress-point/{id}")
    public ResponseEntity<ProgressPoint> editProgressPoint(@PathVariable Long id,
            @Valid @RequestBody ProgressPointDto progressPointDto) {
        ProgressPoint progressPoint = progressPointService.convertToClass(progressPointDto);
        progressPoint.setId(id);
        ProgressPoint updatedProgressPoint = progressPointService.updateProgressPoint(progressPoint);
        return ResponseEntity.ok(updatedProgressPoint);
    }
}
