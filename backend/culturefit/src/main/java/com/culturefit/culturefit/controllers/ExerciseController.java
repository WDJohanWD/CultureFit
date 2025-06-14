package com.culturefit.culturefit.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.culturefit.culturefit.domains.Exercise;
import com.culturefit.culturefit.services.exerciseService.ExerciseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PutMapping;


@Tag(name = "Controlador de los ejercicios", description = "Controlador para gestionar los ejercicios.")
@RestController
public class ExerciseController {
    @Autowired
    ExerciseService exerciseService;

    // Getters
    @Operation(summary = "Obtener todos los ejercicios", description = "Devuelve una lista de todos los ejercicios.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de ejercicios obtenida exitosamente",
            content = @Content(schema = @Schema(implementation = Exercise.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping ("/exercise")
    public List<Exercise> getExercises(){
        List<Exercise> exercises = exerciseService.getExercise();
        return exercises;
    }

    @Operation(summary = "Obtener un ejercicio por ID", description = "Devuelve los datos de un ejercicio por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ejercicio encontrado exitosamente",
            content = @Content(schema = @Schema(implementation = Exercise.class))),
        @ApiResponse(responseCode = "404", description = "Ejercicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del ejercicio", required = true)
    @GetMapping("/exercise/{id}")
    public ResponseEntity<Exercise> getExercise(@PathVariable Long id) {
        Exercise exercise = exerciseService.getExercise(id);
        return ResponseEntity.ok(exercise);
    }

    // Posts
    @Operation(summary = "Crear un nuevo ejercicio", description = "Crea un nuevo ejercicio en la aplicación.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ejercicio creado exitosamente",
            content = @Content(schema = @Schema(implementation = Exercise.class))),
        @ApiResponse(responseCode = "400", description = "Datos de ejercicio inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/new-exercise")
    public ResponseEntity<Exercise> newExercise (@Valid @RequestBody Exercise exercise) {
        Exercise exerciseBD = exerciseService.saveExercise(exercise);
        return ResponseEntity.ok(exerciseBD);
    }

    @Operation(summary = "Subir imagen de ejercicio", description = "Sube una imagen para un ejercicio existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen subida exitosamente"),
        @ApiResponse(responseCode = "404", description = "Ejercicio no encontrado"),
        @ApiResponse(responseCode = "400", description = "Formato de imagen inválido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del ejercicio", required = true)
    @PostMapping("/exercise/upload-image/{id}")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestBody MultipartFile image) throws IOException {
        exerciseService.saveImage(image, id);
        return ResponseEntity.ok("The image has been uploaded successfully");
    }


    //Delete
    @Operation(summary = "Eliminar un ejercicio", description = "Elimina un ejercicio de la aplicación por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Ejercicio eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Ejercicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del ejercicio", required = true)
    @DeleteMapping ("/delete-exercise/{id}")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    // Put
    @Operation(summary = "Editar un ejercicio", description = "Actualiza los datos de un ejercicio existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ejercicio actualizado exitosamente",
            content = @Content(schema = @Schema(implementation = Exercise.class))),
        @ApiResponse(responseCode = "404", description = "Ejercicio no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de ejercicio inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del ejercicio", required = true)
    @PutMapping("/edit-exercise/{id}")
    public ResponseEntity<Exercise> editExercise(@PathVariable Long id, @Valid @RequestBody Exercise exercise) {
        Exercise updatedExercise = exerciseService.updateExercise(id, exercise);
        return ResponseEntity.ok(updatedExercise);
    }
}
