package com.culturefit.culturefit.controllers;

import com.culturefit.culturefit.domains.Workout;
import com.culturefit.culturefit.dto.WorkoutDto;
import com.culturefit.culturefit.services.workoutService.WorkoutService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Controlador de rutinas", description = "Controlador para gestionar las rutinas de los usuarios.")
@RestController
@RequestMapping("/workout")
@SecurityRequirement(name = "bearerAuth")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Operation(summary = "Obtener todas las rutinas", description = "Devuelve una lista de todas las rutinas.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de rutinas obtenida exitosamente",
            content = @Content(schema = @Schema(implementation = Workout.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "userId", description = "Id del usuario", required = false)
    @GetMapping("/user/{userId}")
    public List<Workout> getWorkoutsByUser(@PathVariable Long userId) {
        return workoutService.getAllWorkoutsByUser(userId);
    }

    @Operation(summary = "Obtener una rutina por ID", description = "Devuelve los datos de una rutina por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rutina encontrada exitosamente",
            content = @Content(schema = @Schema(implementation = Workout.class))),
        @ApiResponse(responseCode = "404", description = "Rutina no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id de la rutina", required = true)
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Workout workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    @Operation(summary = "Crear una nueva rutina", description = "Crea una nueva rutina en la aplicación.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rutina creada exitosamente",
            content = @Content(schema = @Schema(implementation = Workout.class))),
        @ApiResponse(responseCode = "400", description = "Datos de rutina inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/new-workout")
    public Workout saveWorkout(@RequestBody Workout workout) {
        return workoutService.saveWorkout(workout);
    }

    @Operation(summary = "Actualizar una rutina", description = "Actualiza los datos de una rutina existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rutina actualizada exitosamente",
            content = @Content(schema = @Schema(implementation = Workout.class))),
        @ApiResponse(responseCode = "404", description = "Rutina no encontrada"),
        @ApiResponse(responseCode = "400", description = "Datos de rutina inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/update-workout")
    public ResponseEntity<List<Workout>> updateWorkoutList(@RequestBody WorkoutDto dto) {
        List<Workout> fullWorkout = workoutService.updateWorkout(dto);
        return ResponseEntity.ok(fullWorkout);
    }
    
    @Operation(summary = "Eliminar una rutina", description = "Elimina una rutina por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Rutina eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Rutina no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id de la rutina", required = true)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}
