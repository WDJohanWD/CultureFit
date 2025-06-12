package com.culturefit.culturefit.dto;

import java.util.List;

import com.culturefit.culturefit.domains.Workout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutDto {
    private Long userId;
    private List<Workout> workoutList;
}
