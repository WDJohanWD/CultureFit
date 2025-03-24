package com.culturefit.culturefit.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domain.User;

public interface UserService {
    User guardarUsuario(User usuario);
    List<User> obtenerUsuarios();
    User obtenerUsuario(Long id);
    User asignarImagen(Long usuarioId, MultipartFile archivo) throws IOException;
}
