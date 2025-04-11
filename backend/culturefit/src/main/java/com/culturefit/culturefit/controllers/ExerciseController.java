package com.culturefit.culturefit.controllers;

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

    //Delete
    @DeleteMapping ("/delete-exercise/{id}")
    public void deleteExercise(Long id) {
        exerciseService.deleteExercise(id);
    }

    // Put
    @PutMapping("/edit-exercise")
    public ResponseEntity<Exercise> editExercise(@Valid @RequestBody Exercise exercise) {
        Exercise updatedExercise = exerciseService.updateExercise(exercise);
        return ResponseEntity.ok(updatedExercise);
    }
}
