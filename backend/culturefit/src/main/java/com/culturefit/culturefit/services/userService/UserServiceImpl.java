package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.exceptions.userExceptions.ErrorSavingUserException;
import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;
import com.culturefit.culturefit.repositories.UserRepository;
import com.culturefit.culturefit.services.profileImageService.ProfileImageService;

import jakarta.validation.Valid;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileImageService profileImageService;

    @Override
    public User saveUser(@Valid User user) throws ErrorSavingUserException {
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new ErrorSavingUserException();
        }
    }

    @Override
    public List<User> getUsers() throws RuntimeException {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new NotFoundUserException();
        }
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(NotFoundUserException::new);
    }

    @Override
    public User assignImage(Long userId, MultipartFile file) throws IOException {
        User user = getUser(userId);

        // Guardar la imagen en la carpeta y obtener la URL con el ID del usuario en el
        // nombre del archivo
        String imageUrl = profileImageService.saveImage(userId, file, user.getName());

        user.setImageUrl(imageUrl);
        return userRepository.save(user);
    }
}
