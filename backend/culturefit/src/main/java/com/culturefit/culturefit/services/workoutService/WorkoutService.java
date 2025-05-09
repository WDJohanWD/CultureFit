package com.culturefit.culturefit.services.workoutService;

import java.util.List;

import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.Workout;
import com.culturefit.culturefit.dto.WorkoutDto;

@Service
public interface WorkoutService {
    public List<Workout> updateWorkout(WorkoutDto workoutDto);
    public Workout getWorkoutById(Long id);
    public Workout saveWorkout(Workout workout);
    public void deleteWorkout(Long id);
    public List<Workout> getAllWorkoutsByUser(Long userId);
}
