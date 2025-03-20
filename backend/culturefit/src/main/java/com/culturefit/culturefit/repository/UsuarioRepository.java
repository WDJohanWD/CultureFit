package com.culturefit.culturefit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.culturefit.culturefit.domain.Usuario;

@Repository
public interface UsuarioRepository  extends JpaRepository<Usuario, Long>{
    Usuario save(Usuario usuario);
}
