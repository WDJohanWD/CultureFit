package com.culturefit.culturefit.services.userService;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;

public interface UserService {
    User saveUser(User user);
    List<User> getUsers();
    User getUser(Long id);
    User assignImage(Long userId, MultipartFile file) throws IOException;
    User getUserByEmail(String email);
    User activateUser(User user);

    boolean deleteUser(Long id);

    User getUserByName(String name);

    User updateUser(Long id, User user);

    User updatePassword(Long userId, String currentPassword, String newPassword);


}

