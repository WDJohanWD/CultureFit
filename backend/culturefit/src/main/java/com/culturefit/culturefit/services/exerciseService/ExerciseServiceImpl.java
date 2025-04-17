package com.culturefit.culturefit.services.exerciseService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.Exercise;
import com.culturefit.culturefit.exceptions.exerciseExceptions.ErrorSavingExerciseException;
import com.culturefit.culturefit.exceptions.exerciseExceptions.NotFoundExerciseException;
import com.culturefit.culturefit.repositories.ExerciseRepository;

@Service
public class ExerciseServiceImpl implements ExerciseService {
    @Autowired
    ExerciseRepository exerciseRepository;

    public Exercise saveExercise(Exercise exercise) {
        try {
            return exerciseRepository.save(exercise);
        } catch (Exception e) {
            throw new ErrorSavingExerciseException();
        }
    }

    public List<Exercise> getExercise() {
        try{
            return exerciseRepository.findAllByOrderByIdAsc();
        } catch (Exception e){
            throw new NotFoundExerciseException();
        }
    }

    public Exercise getExercise(Long id){
        return exerciseRepository.findById(id)
            .orElseThrow(NotFoundExerciseException::new);
    }

    public boolean deleteExercise(Long id) {
        try {
            exerciseRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new NotFoundExerciseException();
        }
    }

    public Exercise updateExercise(Exercise exercise){
        getExercise(exercise.getId()); // Para comprobar si existe
        return exerciseRepository.save(exercise);
    }
}
