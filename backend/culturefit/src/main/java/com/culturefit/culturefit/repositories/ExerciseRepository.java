package com.culturefit.culturefit.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domains.Exercise;



@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long>{
    List<Exercise> findAllByOrderByIdAsc();
}