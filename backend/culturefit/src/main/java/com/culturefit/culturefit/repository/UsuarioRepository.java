package com.culturefit.culturefit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domain.Usuario;

@Repository
public interface UsuarioRepository  extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findById(Long id);
}
