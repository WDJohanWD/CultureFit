package com.culturefit.culturefit.service.userService;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domain.User;
import com.culturefit.culturefit.exception.userExceptions.ErrorSavingUserException;
import com.culturefit.culturefit.exception.userExceptions.NotFoundUserException;
import com.culturefit.culturefit.repository.UsuarioRepository;
import com.culturefit.culturefit.service.profileImageService.ProfileImageService;

import jakarta.validation.Valid;

@Service
public class UserServiceImpl implements UserService {
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
    
    @Override
    public User asignarImagen(Long usuarioId, MultipartFile archivo) throws IOException{
        User usuario = obtenerUsuario(usuarioId);

        // Guardar la imagen en la carpeta y obtener la URL con el ID del usuario en el nombre del archivo
        String urlImagen = profileImageService.guardarImagen(usuarioId, archivo, usuario.getName());

        usuario.setImageUrl(urlImagen);
        return usuarioRepository.save(usuario);
    }

    @Override
    public User getUserByEmail(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(NotFoundUserException::new);
    }

    @Override
    public User activateUser(User user) {
        user.setActive(true);
        try {
            return usuarioRepository.save(user);
        } catch (Exception e) {
            throw new ErrorSavingUserException();
        }
    }
}
