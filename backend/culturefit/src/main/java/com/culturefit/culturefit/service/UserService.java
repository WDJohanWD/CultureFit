package com.culturefit.culturefit.service;

import java.util.List;

import com.culturefit.culturefit.domain.User;

public interface UserService {
    User guardarUsuario(User usuario);
    List<User> obtenerUsuarios();
    User obtenerUsuario(Long id);
}
