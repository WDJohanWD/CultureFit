package com.culturefit.culturefit.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domains.ProgressPoint;

@Repository
public interface ProgressPointRepository extends JpaRepository<ProgressPoint, Long>{
    public List<ProgressPoint> findByUserId(Long userId); // Buscar los puntos de progreso de un usuario
}
