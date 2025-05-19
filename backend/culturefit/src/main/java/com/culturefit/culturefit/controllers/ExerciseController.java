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

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
public class ExerciseController {
    @Autowired
    ExerciseService exerciseService;

    // Getters
    @GetMapping ("/exercise")
    public List<Exercise> getExercises(){
        List<Exercise> exercises = exerciseService.getExercise();
        return exercises;
    }

    @GetMapping("/exercise/{id}")
    public ResponseEntity<Exercise> getExercise(@PathVariable Long id) {
        Exercise exercise = exerciseService.getExercise(id);
        return ResponseEntity.ok(exercise);
    }

    // Posts
    @PostMapping("/new-exercise")
    public ResponseEntity<Exercise> newExercise (@Valid @RequestBody Exercise exercise) {
        Exercise exerciseBD = exerciseService.saveExercise(exercise);
        return ResponseEntity.ok(exerciseBD);
    }

    @PostMapping("/exercise/upload-image/{id}")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestBody MultipartFile image) throws IOException {
        exerciseService.saveImage(image, id);
        return ResponseEntity.ok("The image has been uploaded successfully");
    }


    //Delete
    @DeleteMapping ("/delete-exercise/{id}")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    // Put
    @PutMapping("/edit-exercise/{id}")
    public ResponseEntity<Exercise> editExercise(@PathVariable Long id, @Valid @RequestBody Exercise exercise) {
        Exercise updatedExercise = exerciseService.updateExercise(id, exercise);
        return ResponseEntity.ok(updatedExercise);
    }
}
