package com.culturefit.culturefit.domains;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1)
    @Max(value = 7)
    private Integer dayNumber;

    @Min(value = 1)
    private Integer sets;

    @ManyToOne
    @OnDelete (action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne
    @OnDelete (action = OnDeleteAction.CASCADE)
    private Exercise exercise;
}
