package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.UserEditDto;
import com.culturefit.culturefit.exceptions.userExceptions.ErrorSavingUserException;
import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;
import com.culturefit.culturefit.repositories.UserRepository;
import com.culturefit.culturefit.services.profileImageService.ProfileImageService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.validation.Valid;

@Service
public class UserServiceImpl implements UserService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        String imageUrl = profileImageService.saveImage(userId, file, user.getDni());

        user.setImageUrl(imageUrl);
        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(NotFoundUserException::new);
    }

    @Override
    public User getUserByName(String name) {
        return userRepository.findByName(name)
                .orElseThrow(NotFoundUserException::new);
    }

    @Override
    public User activateUser(User user) {
        user.setActive(true);
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new ErrorSavingUserException();
        }
    }

    @Override
    public boolean deleteUser(Long id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new NotFoundUserException();
        }
    }

    @Override
    public User updateUser(Long id, User user) {
        User userToUpdate = getUser(id);
        userToUpdate.setName(user.getName());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setBirthDate(user.getBirthDate());
        userToUpdate.setPassword(user.getPassword());
        userToUpdate.setActive(user.isActive());
        return userRepository.save(userToUpdate);
    }

    @Override
    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = getUser(userId); // esto ya lanza la excepción si no existe

        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta.");// Hacer luego excepción personalizada
        }

        // Establecer nueva contraseña encriptada
        user.setPassword(passwordEncoder.encode(newPassword));

        return userRepository.save(user);
    }

    @Override
    public User resetPassword(String token, String newPassword) {

        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        Long userId = Long.valueOf(claims.getSubject());

        User user = getUser(userId);
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Override
    public User updateUserEdit(Long id, UserEditDto user) throws RuntimeException {
        User userToUpdate = getUser(id);
        userToUpdate.setActive(user.isActive());
        userToUpdate.setRole(user.getRole());
        return userRepository.save(userToUpdate);
    }
}
