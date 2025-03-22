package com.culturefit.culturefit.service;

import java.util.List;
import java.util.Optional;

import com.culturefit.culturefit.domain.Usuario;

public interface UsuarioService {
    Usuario guardarUsuario(Usuario usuario);
    List<Usuario> obtenerUsuarios();
    Usuario obtenerUsuario(Long id);
}
