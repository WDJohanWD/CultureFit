package com.culturefit.culturefit.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domain.User;
import com.culturefit.culturefit.domain.UserDTO;
import com.culturefit.culturefit.service.userService.UserDTOConverter;
import com.culturefit.culturefit.service.userService.UserService;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserDTOConverter userDTOConverter;

    //Getters
    @GetMapping("/users")
    public List<User> obtenerUsuarios() {
        List<User> users = userService.obtenerUsuarios();
        return users;
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> obtenerUsuario(@PathVariable Long id) {
        User user = userService.obtenerUsuario(id);
        return ResponseEntity.ok(user);
    }

    //Posts
    @PostMapping("/user")
    public ResponseEntity<?> nuevoUsuario(@Valid @RequestBody User usuario, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Si hay errores de validación, devolver un error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getAllErrors());
        }

        User save = userService.guardarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(save);
    }

    @PostMapping("/user/upload-profile-image/{id}")
    public ResponseEntity<?> postProfileImage(@PathVariable Long id, @RequestBody MultipartFile image) throws IOException {
        userService.asignarImagen(id, image);
        return ResponseEntity.ok("Se ha subido correctamente la imagen");
    }

    @PostMapping("/newUserDTO")
    public ResponseEntity<?> newUserDTO(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Si hay errores de validación, devolver un error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getAllErrors());
        }
        userService.guardarUsuario(userDTOConverter.DtoToUser(userDTO));
        return ResponseEntity.ok("Se ha guardado el usuario correctamente");
    }
}
