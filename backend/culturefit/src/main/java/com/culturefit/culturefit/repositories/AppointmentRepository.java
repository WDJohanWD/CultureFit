package com.culturefit.culturefit.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domains.Appointment;
import java.util.List;
import com.culturefit.culturefit.domains.User;


@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>{
    Optional<Appointment> findById(Long id);
    void deleteById(Long id);
    List<Appointment> findByUser(User user);
}
