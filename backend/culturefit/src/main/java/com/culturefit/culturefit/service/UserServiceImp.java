package com.culturefit.culturefit.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domain.User;
import com.culturefit.culturefit.exception.ErrorSavingUserException;
import com.culturefit.culturefit.exception.NotFoundUserException;
import com.culturefit.culturefit.repository.UsuarioRepository;

import jakarta.validation.Valid;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public User guardarUsuario(@Valid User usuario) throws ErrorSavingUserException {
        try {
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new ErrorSavingUserException();
        }
    }

    @Override
    public List<User> obtenerUsuarios() throws RuntimeException {
        try {

            return usuarioRepository.findAll();
        } catch (Exception e) {
            throw new NotFoundUserException();
        }
    }

    @Override
    public User obtenerUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(NotFoundUserException::new);
    }

}
