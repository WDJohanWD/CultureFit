package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
import com.culturefit.culturefit.services.appointmentService.AppointmentService;
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
        // userRepository.findById(id).orElseThrow().setAppointmentsAvailables(0);
        // userRepository.save(userRepository.findById(id).orElseThrow());

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
    public User getUserByStryipeId(String id) {
        return userRepository.findByStripeId(id)
            .orElseThrow(NotFoundUserException::new);
    }


    @Override
    public List<User> searchUsersByName(String search) {
        List<User> users = userRepository.searchByName(search);
        return users;
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

        String email = claims.getSubject();
        User user = getUserByEmail(email);
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

    @Override
    public User redeemAppointment(Long id) throws RuntimeException {
        User user = getUser(id);
        user.setAppointmentsAvailables(user.getAppointmentsAvailables() - 1);
        user = userRepository.save(user);
        return user;
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
            throw new RuntimeException("No puedes enviarte una solicitud a ti mismo.");
        }

        User sender = getUser(senderId);
        User receiver = getUser(receiverId);

        if (sender.getFriendList().contains(receiver)) {
            throw new RuntimeException("Ya sois amigos.");
        }

        if (receiver.getFriendRequestsReceived().contains(sender)) {
            throw new RuntimeException("Ya has enviado una solicitud a este usuario.");
        }

        receiver.getFriendRequestsReceived().add(sender);

        userRepository.save(receiver);
    }

    @Override
    public void acceptFriendRequest(Long receiverId, Long senderId) {
        User receiver = getUser(receiverId);
        User sender = getUser(senderId);

        if (!receiver.getFriendRequestsReceived().contains(sender)) {
            throw new RuntimeException("No hay solicitud de amistad de este usuario.");
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
            throw new RuntimeException("No hay solicitud de amistad de este usuario.");
        }

        receiver.getFriendRequestsReceived().remove(sender);
        userRepository.save(receiver);
    }

    @Override
    public void removeFriend(Long userId, Long friendId) {
        User user = getUser(userId);
        User friend = getUser(friendId);

        if (!user.getFriendList().contains(friend)) {
            throw new RuntimeException("Este usuario no es tu amigo.");
        }

        user.getFriendList().remove(friend);
        friend.getFriendList().remove(user);

        userRepository.save(user);
        userRepository.save(friend);
    }
}
