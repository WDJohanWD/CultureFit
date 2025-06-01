package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.UserEditDto;

public interface UserService {

    // --- Gestión básica de usuarios ---
    User saveUser(User user);

    List<User> getUsers();

    User getUser(Long id);

    boolean deleteUser(Long id);

    User updateUser(Long id, User user);

    User activateUser(User user);

    // --- Consulta por atributos ---
    User getUserByEmail(String email);

    User getUserByName(String name);

    User getUserByStryipeId(String id);

    List<User> searchUsersByName(String search);

    // --- Imagen de perfil ---
    User assignImage(Long userId, MultipartFile file) throws IOException;

    // --- Contraseña ---
    User updatePassword(Long userId, String currentPassword, String newPassword);

    User resetPassword(String token, String newPassword);

    // --- Edición parcial de usuario ---
    User updateUserEdit(Long id, UserEditDto user) throws IOException;

    // --- Citas (Appointments) ---
    User redeemAppointment(Long id);

    // --- Gestión de amigos ---
    List<User> getFriendRequests(Long userId);

    List<User> getFriends(Long userId);

    void sendFriendRequest(Long senderId, Long receiverId);

    void acceptFriendRequest(Long receiverId, Long senderId);

    void rejectFriendRequest(Long receiverId, Long senderId);

    void removeFriend(Long userId, Long friendId);
}
