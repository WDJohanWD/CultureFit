package com.culturefit.culturefit.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.services.userService.UserService;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.culturefit.culturefit.dto.PasswordUpdateDto;
import com.culturefit.culturefit.dto.UserEditDto;

@RestController
@Validated
public class UserController {

    
    @Autowired
    private UserService userService;

    //Getters
    @GetMapping("/users")
    public List<User> getUsers() {
        List<User> users = userService.getUsers();
        return users;
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    //Posts
    @PostMapping("/user")
    public ResponseEntity<User> postUser(@Valid @RequestBody User user) {
        User userSaved = userService.saveUser(user);
        return ResponseEntity.ok(userSaved);
    }
    
    @PostMapping("/user/upload-profile-image/{id}")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestBody MultipartFile image) throws IOException {
        userService.assignImage(id, image);
        return ResponseEntity.ok("The image has been uploaded successfully");
    }

    //Put
    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        User userUpdated = userService.updateUser(id, user);
        return ResponseEntity.ok(userUpdated);
    }

    @PutMapping("/updatePassword/{userId}")
    public ResponseEntity<User> updatePassword(@PathVariable Long userId, @RequestBody PasswordUpdateDto passwordUpdateDTO) {
        User updatedUser = userService.updatePassword(userId, passwordUpdateDTO.getCurrentPassword(), passwordUpdateDTO.getNewPassword());
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/user-edit/{id}")
    public ResponseEntity<User> updateUserEdit(@PathVariable Long id, @Valid @RequestBody UserEditDto user) throws Exception {
        User userUpdated = userService.updateUserEdit(id, user);
        return ResponseEntity.ok(userUpdated);
    }

    
    //Delete
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("The user has been deleted successfully");
    }



}
