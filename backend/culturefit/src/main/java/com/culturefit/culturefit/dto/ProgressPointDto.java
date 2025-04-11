package com.culturefit.culturefit.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ProgressPointDto {
    private Long id;

    @Min(value = 1)
    private double weight;

    @Min(value = 1)
    private Integer repetitions;

    private LocalDate date;
    
    private Long userId;

    private Long exerciseId;
}
