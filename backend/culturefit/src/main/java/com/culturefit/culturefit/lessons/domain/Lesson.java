package com.culturefit.culturefit.lessons.domain;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "lessons")
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Lesson{
    @Id
    @GeneratedValue
    private Long id;
    private String nameES;
    private String nameEN;
    private String descriptionES;
    private String descriptionEN;
    private String videoUrl;
    private String thumbnailUrl;
    private LocalDate uploadDate;
}


