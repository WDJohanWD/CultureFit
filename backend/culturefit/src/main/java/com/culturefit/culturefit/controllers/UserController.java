package com.culturefit.culturefit.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.services.userService.UserService;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.culturefit.culturefit.dto.FriendRequestDto;
import com.culturefit.culturefit.dto.PasswordUpdateDto;
import com.culturefit.culturefit.dto.UserDTO;
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

    @GetMapping("/username/{name}")
    public ResponseEntity<UserDTO> getUserByName(@PathVariable String name) {
        User user = userService.getUserByName(name);
        UserDTO dto = new UserDTO(user.getId(), user.getName(), user.getImageUrl());
        return ResponseEntity.ok(dto);
    }
    
    @GetMapping("/search/{search}")
    public List<UserDTO> searchUsers(@PathVariable String search) {
        return userService.searchUsersByName(search).stream()
        .map(user -> new UserDTO(user.getId(), user.getName(), user.getImageUrl()))
        .toList();
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


    // Peticiones de amistad
    // Obtener todas las solicitudes de amistad recibidas por un usuario
    @GetMapping("/{userId}/friend-requests")
    public ResponseEntity<List<User>> getFriendRequests(@PathVariable Long userId) {
        List<User> requests = userService.getFriendRequests(userId);
        return ResponseEntity.ok(requests);
    }

    // Obtener todos los amigos del usuario
    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<User>> getFriends(@PathVariable Long userId) {
        List<User> friends = userService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }


    // Enviar solicitud
    @PostMapping("/friend-request/send")
    public ResponseEntity<Void> sendFriendRequest(@RequestBody FriendRequestDto request) {
        userService.sendFriendRequest(request.senderId(), request.receiverId());
        return ResponseEntity.ok().build();
    }

    // Aceptar una solicitud de amistad
    @PutMapping("/friend-request/accept")
    public ResponseEntity<Void> acceptFriendRequest(@RequestBody FriendRequestDto request) {
        userService.acceptFriendRequest(request.receiverId(), request.senderId());
        return ResponseEntity.ok().build();
    }

    // Rechazar una solicitud de amistad
    @PutMapping("/friend-request/reject")
    public ResponseEntity<Void> rejectFriendRequest(@RequestBody FriendRequestDto request) {
        userService.rejectFriendRequest(request.receiverId(), request.senderId());
        return ResponseEntity.ok().build();
    }

    // Eliminar a un amigo
    @DeleteMapping("/friend/delete")
    public ResponseEntity<Void> removeFriend(@RequestBody FriendRequestDto request) {
        userService.removeFriend(request.senderId(), request.receiverId());
        return ResponseEntity.ok().build();
    }
}
