package com.culturefit.culturefit.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domains.ProgressPoint;

@Repository
public interface ProgressPointRepository extends JpaRepository<ProgressPoint, Long>{
    // Buscar los  puntos de progreso que tengan un id de usuario y un id de ejercicio y ordenarlos por fecha
    public List<ProgressPoint> findByUserIdAndExerciseIdOrderByDateAsc(Long userId, Long exerciseId);

    // Buscar el último punto de progreso de un usuario en un ejercicio en concreto
    public Optional<ProgressPoint> findFirstByUserIdAndExerciseIdOrderByDateDesc(Long userId, Long exerciseId);
}
