package com.culturefit.culturefit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domain.User;

@Repository
public interface UsuarioRepository  extends JpaRepository<User, Long>{
    Optional<User> findById(Long id);
}
