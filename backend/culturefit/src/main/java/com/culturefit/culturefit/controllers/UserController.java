package com.culturefit.culturefit.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.services.userService.UserService;
import com.stripe.exception.StripeException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import com.culturefit.culturefit.dto.ResetPasswordDto;
import com.culturefit.culturefit.dto.FriendRequestDto;
import com.culturefit.culturefit.dto.PasswordUpdateDto;
import com.culturefit.culturefit.dto.UserDTO;
import com.culturefit.culturefit.dto.UserEditDto;
import com.culturefit.culturefit.payments.service.PaymentService;

@Tag(name = "Controlador de usuarios", description = "Controlador para gestionar usuarios.")
@RestController
@Validated
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    // Getters
    @Operation(summary = "Obtener todos los usuarios", description = "Devuelve una lista de todos los usuarios.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/users")
    public List<User> getUsers() {
        List<User> users = userService.getUsers();
        return users;
    }

    @Operation(summary = "Obtener un usuario por ID", description = "Devuelve los datos de un usuario por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del usuario", required = true)
    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Obtener un usuario por nombre", description = "Devuelve los datos de un usuario por su nombre.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado exitosamente",
            content = @Content(schema = @Schema(implementation = UserDTO.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "name", description = "Nombre del usuario", required = true)
    @GetMapping("/username/{name}")
    public ResponseEntity<UserDTO> getUserByName(@PathVariable String name) {
        User user = userService.getUserByName(name);
        UserDTO dto = new UserDTO(user.getId(), user.getName(), user.getImageUrl());
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Buscar usuarios por nombre", description = "Devuelve una lista de usuarios que coinciden con el nombre proporcionado.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente",
            content = @Content(schema = @Schema(implementation = UserDTO.class))),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "search", description = "Nombre o parte del nombre del usuario a buscar", required = true)
    @GetMapping("/search/{search}")
    public List<UserDTO> searchUsers(@PathVariable String search) {
        return userService.searchUsersByName(search).stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getImageUrl()))
                .toList();
    }

    // Posts
    @Operation(summary = "Crear un nuevo usuario", description = "Crea un nuevo usuario en la aplicación.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario creado exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "400", description = "Datos de usuario inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/user")
    public ResponseEntity<User> postUser(@Valid @RequestBody User user) {
        User userSaved = userService.saveUser(user);
        return ResponseEntity.ok(userSaved);
    }

    @Operation(summary = "Subir imagen de perfil", description = "Sube una imagen de perfil para un usuario existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen subida exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Formato de imagen inválido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del usuario", required = true)
    @PostMapping("/user/upload-profile-image/{id}")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestBody MultipartFile image)
            throws IOException {
        userService.assignImage(id, image);
        return ResponseEntity.ok("The image has been uploaded successfully");
    }

    // Put
    @Operation(summary = "Actualizar un usuario", description = "Actualiza los datos de un usuario existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de usuario inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del usuario", required = true)
    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        User userUpdated = userService.updateUser(id, user);
        return ResponseEntity.ok(userUpdated);
    }

    @Operation(summary = "Actualizar la contraseña de un usuario", description = "Actualiza la contraseña de un usuario existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña actualizada exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Contraseña actual incorrecta"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @PutMapping("/updatePassword/{userId}")
    public ResponseEntity<User> updatePassword(@PathVariable Long userId,
            @RequestBody PasswordUpdateDto passwordUpdateDTO) {
        User updatedUser = userService.updatePassword(userId, passwordUpdateDTO.getCurrentPassword(),
                passwordUpdateDTO.getNewPassword());
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Restablecer la contraseña de un usuario", description = "Restablece la contraseña de un usuario utilizando un token.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña restablecida exitosamente"),
        @ApiResponse(responseCode = "400", description = "Token inválido o expirado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        userService.resetPassword(resetPasswordDto.getToken(), resetPasswordDto.getPassword());
        return ResponseEntity.ok("Password has been reset successfully");
    }

    @Operation(summary = "Actualizar los datos de edición de un usuario", description = "Actualiza los datos de edición de un usuario existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de usuario inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del usuario", required = true)
    @PutMapping("/user-edit/{id}")
    public ResponseEntity<User> updateUserEdit(@PathVariable Long id, @Valid @RequestBody UserEditDto user)
            throws Exception {
        User userUpdated = userService.updateUserEdit(id, user);
        return ResponseEntity.ok(userUpdated);
    }

    // Delete
    @Operation(summary = "Eliminar un usuario", description = "Elimina un usuario de la aplicación por su ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id del usuario", required = true)
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("The user has been deleted successfully");
    }

    // Peticiones de amistad
    // Obtener todas las solicitudes de amistad recibidas por un usuario
    @Operation(summary = "Obtener solicitudes de amistad", description = "Devuelve una lista de solicitudes de amistad recibidas por un usuario.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitudes obtenidas exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @GetMapping("/{userId}/friend-requests")
    public ResponseEntity<List<User>> getFriendRequests(@PathVariable Long userId) {
        List<User> requests = userService.getFriendRequests(userId);
        return ResponseEntity.ok(requests);
    }

    // Obtener todos los amigos del usuario
    @Operation(summary = "Obtener amigos de un usuario", description = "Devuelve una lista de amigos de un usuario.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de amigos obtenida exitosamente",
            content = @Content(schema = @Schema(implementation = User.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<User>> getFriends(@PathVariable Long userId) {
        List<User> friends = userService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }

    // Enviar solicitud
    @Operation(summary = "Enviar solicitud de amistad", description = "Envía una solicitud de amistad de un usuario a otro.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud enviada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/friend-request/send")
    public ResponseEntity<Void> sendFriendRequest(@RequestBody FriendRequestDto request) {
        userService.sendFriendRequest(request.senderId(), request.receiverId());
        return ResponseEntity.ok().build();
    }

    // Aceptar una solicitud de amistad
    @Operation(summary = "Aceptar solicitud de amistad", description = "Acepta una solicitud de amistad recibida por un usuario.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud aceptada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping("/friend-request/accept")
    public ResponseEntity<Void> acceptFriendRequest(@RequestBody FriendRequestDto request) {
        userService.acceptFriendRequest(request.receiverId(), request.senderId());
        return ResponseEntity.ok().build();
    }

    // Rechazar una solicitud de amistad
    @Operation(summary = "Rechazar solicitud de amistad", description = "Rechaza una solicitud de amistad recibida por un usuario.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud rechazada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping("/friend-request/reject")
    public ResponseEntity<Void> rejectFriendRequest(@RequestBody FriendRequestDto request) {
        userService.rejectFriendRequest(request.receiverId(), request.senderId());
        return ResponseEntity.ok().build();
    }

    // Eliminar a un amigo
    @Operation(summary = "Eliminar amigo", description = "Elimina a un amigo de la lista de amigos de un usuario.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Amigo eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/friend/delete")
    public ResponseEntity<Void> removeFriend(@RequestBody FriendRequestDto request) {
        userService.removeFriend(request.senderId(), request.receiverId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cancel-subscription/{userId}")
    public ResponseEntity<String> cancelSubscription(@PathVariable Long userId) {
        try {
            paymentService.cancelActiveSubscriptionsByUserId(userId);
            return ResponseEntity.ok("Suscripción cancelada correctamente.");
        } catch (StripeException e) {
            return ResponseEntity.status(500).body("Error con Stripe al cancelar la suscripción.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error inesperado al cancelar la suscripción.");
        }
    }
}