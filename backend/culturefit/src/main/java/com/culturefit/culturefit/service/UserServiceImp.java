package com.culturefit.culturefit.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domain.User;
import com.culturefit.culturefit.exception.userExceptions.ErrorSavingUserException;
import com.culturefit.culturefit.exception.userExceptions.NotFoundUserException;
import com.culturefit.culturefit.repository.UsuarioRepository;

import jakarta.validation.Valid;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProfileImageService profileImageService;

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
    
    //TODO: Manejar errores al asignar imagen
    @Override
    public User asignarImagen(Long usuarioId, MultipartFile archivo) throws IOException{
        User usuario = obtenerUsuario(usuarioId);

        // Guardar la imagen en la carpeta y obtener la URL con el ID del usuario en el nombre del archivo
        String urlImagen = profileImageService.guardarImagen(usuarioId, archivo, usuario.getName());

        usuario.setImageUrl(urlImagen);
        return usuarioRepository.save(usuario);
    }
}
