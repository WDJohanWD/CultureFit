package com.culturefit.culturefit.services.exerciseService;

import java.util.List;

import com.culturefit.culturefit.domains.Exercise;

public interface ExerciseService {
    Exercise saveExercise(Exercise exercise);
    List<Exercise> getExercise();
    Exercise getExercise(Long id);
    boolean deleteExercise(Long id);
    Exercise updateExercise(Exercise exercise);
}

