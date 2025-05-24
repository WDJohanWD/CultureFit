package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.UserEditDto;

public interface UserService {
    User saveUser(User user);
    List<User> getUsers();
    User getUser(Long id);
    User assignImage(Long userId, MultipartFile file) throws IOException;
    User getUserByEmail(String email);
    User activateUser(User user);

    boolean deleteUser(Long id);

    User getUserByName(String name);
    List<User> searchUsersByName(String search);

    User updateUser(Long id, User user);

    User updatePassword(Long userId, String currentPassword, String newPassword);

    User updateUserEdit(Long id, UserEditDto user) throws IOException;

    List<User> getFriendRequests(Long userId);

    List<User> getFriends(Long userId);

    void sendFriendRequest(Long senderId, Long receiverId);

    void acceptFriendRequest(Long receiverId, Long senderId);

    void rejectFriendRequest(Long receiverId, Long senderId);

    void removeFriend(Long userId, Long friendId);
}

