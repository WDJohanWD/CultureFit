package com.culturefit.culturefit.services.exerciseService;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.Exercise;

public interface ExerciseService {
    Exercise saveExercise(Exercise exercise);
    List<Exercise> getExercise();
    Exercise getExercise(Long id);
    boolean deleteExercise(Long id);
    Exercise updateExercise(Long id, Exercise exercise);
    Exercise saveImage(MultipartFile file,Long exerciseId);
    String getExtension(String fileName);
}

