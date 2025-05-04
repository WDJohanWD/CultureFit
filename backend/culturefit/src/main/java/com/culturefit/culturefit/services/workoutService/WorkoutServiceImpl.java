package com.culturefit.culturefit.services.workoutService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.Workout;
import com.culturefit.culturefit.dto.WorkoutDto;
import com.culturefit.culturefit.exceptions.workoutExceptions.ErrorSavingWorkoutException;
import com.culturefit.culturefit.exceptions.workoutExceptions.NotFoundWorkoutException;
import com.culturefit.culturefit.repositories.WorkoutRepository;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    @Autowired
    WorkoutRepository workoutRepository;

    public void updateWorkout(WorkoutDto workoutDto){
        List<Workout> oldList = workoutRepository.findByUserId(workoutDto.getUserId());
        List<Workout> updatedList = workoutDto.getWorkoutList();

        Set<Long> updatedIds = updatedList.stream()
                           .map(Workout::getId)
                           .filter(e -> e != null)
                           .collect(Collectors.toSet());


        // Para eliminar  los  ejercicios que ya no estan en la lista
        for(Workout workout : oldList){
            if (!updatedIds.contains(workout.getId())){
                try{
                    workoutRepository.delete(workout);
                } catch (Exception e) {
                    throw new NotFoundWorkoutException();
                }
            }
        }

        // Para actualizar los ejercicios y subir los workouts
        for(Workout workout : updatedList){
            if(workout.getId() == null){
                try{
                    workoutRepository.save(workout);
                } catch (Exception e) {
                    throw new ErrorSavingWorkoutException();
                }
            } else {
                Workout updated = workoutRepository.findById(workout.getId())
                    .orElseThrow(() -> new NotFoundWorkoutException());

                updated.setDayNumber(workout.getDayNumber());
                updated.setSets(workout.getSets());
                updated.setExercise(workout.getExercise());
                workoutRepository.save(updated);
            }
        }
    }

    public Workout getWorkoutById(Long id) {
        return workoutRepository.findById(id)
            .orElseThrow(() -> new NotFoundWorkoutException());
    }

    public Workout saveWorkout(Workout workout) {
        try{
            return workoutRepository.save(workout);
        } catch (Exception e) {
            throw new ErrorSavingWorkoutException();
        }
        
    }

    public void deleteWorkout(Long id) {
        try{
            workoutRepository.deleteById(id);
        } catch (Exception e) {
            throw new NotFoundWorkoutException();
        }
    }

    public List<Workout> getAllWorkoutsByUser(Long userId) {
        return workoutRepository.findByUserId(userId);
    }

}
