package com.culturefit.culturefit.controllers;

import com.culturefit.culturefit.domains.Workout;
import com.culturefit.culturefit.dto.WorkoutDto;
import com.culturefit.culturefit.services.workoutService.WorkoutService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/workout")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @GetMapping("/user/{userId}")
    public List<Workout> getWorkoutsByUser(@PathVariable Long userId) {
        return workoutService.getAllWorkoutsByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Workout workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    @PostMapping("/new-workout")
    public Workout saveWorkout(@RequestBody Workout workout) {
        return workoutService.saveWorkout(workout);
    }

    @PostMapping("/update-workout")
    public ResponseEntity<List<Workout>> updateWorkoutList(@RequestBody WorkoutDto dto) {
        List<Workout> fullWorkout = workoutService.updateWorkout(dto);
        return ResponseEntity.ok(fullWorkout);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}
