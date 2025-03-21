package com.culturefit.culturefit.service;

import java.lang.classfile.ClassFile.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domain.Usuario;
import com.culturefit.culturefit.exception.ErrorSavingUserException;
import com.culturefit.culturefit.exception.NotFoundUserException;
import com.culturefit.culturefit.repository.UsuarioRepository;

@Service
public class UsuarioServiceImp implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Usuario guardarUsuario(Usuario usuario) throws ErrorSavingUserException {
        try {
            // Intentar guardar al usuario en la base de datos
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            // Si ocurre una excepción, lanzar nuestra excepción personalizada
            throw new ErrorSavingUserException();
        }
    }

    @Override
    public List<Usuario> obtenerUsuarios() {
        try{

            return usuarioRepository.findAll();
        }catch (Exception e){
            throw new NotFoundUserException();
        }
    }

    @Override
    public Optional<Usuario> obtenerUsuario(Long id) {
        try{
            return usuarioRepository.findById(id);
        }catch (Exception e){
            throw new NotFoundUserException();
        }
    }

}
