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

    User resetPassword(String token, String newPassword);

    User activateUser(User user);

    boolean deleteUser(Long id);

    User getUserByName(String name);

    User getUserByStryipeId(String id);
    List<User> searchUsersByName(String search);

    User updateUser(Long id, User user);

    User updatePassword(Long userId, String currentPassword, String newPassword);

    User updateUserEdit(Long id, UserEditDto user) throws IOException;


}

