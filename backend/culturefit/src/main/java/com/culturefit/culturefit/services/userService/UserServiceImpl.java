package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.UserEditDto;
import com.culturefit.culturefit.exceptions.userExceptions.ErrorSavingUserException;
import com.culturefit.culturefit.exceptions.userExceptions.NotFoundUserException;
import com.culturefit.culturefit.repositories.UserRepository;
import com.culturefit.culturefit.services.appointmentService.AppointmentService;
import com.culturefit.culturefit.services.profileImageService.ProfileImageService;

import jakarta.validation.Valid;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileImageService profileImageService;

    @Autowired
    private AppointmentService appointmentService;

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
            appointmentService.deleteByUser(id);
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
    public User updateUserEdit(Long id, UserEditDto user) throws RuntimeException {
        User userToUpdate = getUser(id);
        userToUpdate.setActive(user.isActive());
        userToUpdate.setRole(user.getRole());
        return userRepository.save(userToUpdate);
    }



    // Peticiones de amistad
    @Override
    public List<User> getFriendRequests(Long userId) {
        User user = getUser(userId);
        return new ArrayList<>(user.getFriendRequestsReceived());
    }

    @Override
    public List<User> getFriends(Long userId) {
        User user = getUser(userId);
        return new ArrayList<>(user.getFriendList());
    }

    @Override
    public void sendFriendRequest(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("No puedes enviarte una solicitud a ti mismo.");
        }

        User sender = getUser(senderId);
        User receiver = getUser(receiverId);

        if (sender.getFriendList().contains(receiver)) {
            throw new IllegalStateException("Ya sois amigos.");
        }

        if (receiver.getFriendRequestsReceived().contains(sender)) {
            throw new IllegalStateException("Ya has enviado una solicitud a este usuario.");
        }

        receiver.getFriendRequestsReceived().add(sender);

        userRepository.save(receiver);
    }

    @Override
    public void acceptFriendRequest(Long receiverId, Long senderId) {
        User receiver = getUser(receiverId);
        User sender = getUser(senderId);

        if (!receiver.getFriendRequestsReceived().contains(sender)) {
            throw new IllegalStateException("No hay solicitud de amistad de este usuario.");
        }

        // Eliminar solicitud
        receiver.getFriendRequestsReceived().remove(sender);

        // Añadir a la lista de amigos (en ambos sentidos)
        receiver.getFriendList().add(sender);
        sender.getFriendList().add(receiver);

        userRepository.save(receiver);
        userRepository.save(sender);
    }

    @Override
    public void rejectFriendRequest(Long receiverId, Long senderId) {
        User receiver = getUser(receiverId);
        User sender = getUser(senderId);

        if (!receiver.getFriendRequestsReceived().contains(sender)) {
            throw new IllegalStateException("No hay solicitud de amistad de este usuario.");
        }

        receiver.getFriendRequestsReceived().remove(sender);
        userRepository.save(receiver);
    }

    @Override
    public void removeFriend(Long userId, Long friendId) {
        User user = getUser(userId);
        User friend = getUser(friendId);

        if (!user.getFriendList().contains(friend)) {
            throw new IllegalStateException("Este usuario no es tu amigo.");
        }

        user.getFriendList().remove(friend);
        friend.getFriendList().remove(user);

        userRepository.save(user);
        userRepository.save(friend);
    }
}
