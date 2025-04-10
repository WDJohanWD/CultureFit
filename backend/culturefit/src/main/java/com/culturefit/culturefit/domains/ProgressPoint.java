package com.culturefit.culturefit.domains;

import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProgressPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1)
    private double weight;

    @Min(value = 1)
    private Integer repetitions;

    private LocalDate date;

    @ManyToOne
    @OnDelete (action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne
    @OnDelete (action = OnDeleteAction.CASCADE)
    private Exercise exercise;
}
