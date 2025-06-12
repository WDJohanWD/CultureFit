package com.culturefit.culturefit.emails.controller;

import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.emails.domain.EmailQrDto;
import com.culturefit.culturefit.emails.domain.EmailRequest;
import com.culturefit.culturefit.emails.domain.EmailResetPasswordDto;
import com.culturefit.culturefit.emails.service.EmailService;
import com.culturefit.culturefit.services.userService.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Controlador de correos", description = "Controlador para gestionar los distintos envíos de correos.")
@RestController
public class EmailController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Value("${app.jwt.secret.confirmation}")
    private String jwtSecretConfirmation;

    @Operation(summary = "Enviar un correo electrónico", description = "Envía un correo electrónico con el asunto y el mensaje proporcionados.")
    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@Valid @RequestBody EmailRequest request, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data in the request");
        }

        emailService.sendEmail(request.getEmail(), request.getSubject(), request.getTextMessage());
        return ResponseEntity.status(HttpStatus.OK).body("Email sent successfully");
    }

    @Operation(summary = "Enviar correo de verificación", description = "Envía un correo electrónico de verificación al usuario.")
    @PostMapping("/verification-email")
    public ResponseEntity<?> sendVerifyEmail(@RequestBody String email) {
        emailService.sendConfirmationEmail(email);
        return ResponseEntity.ok("Email enviado correctamente");
    }

    @Operation(summary = "Confirmar cuenta", description = "Confirma la cuenta del usuario utilizando un token JWT.")
    @PostMapping("/confirm-account")
    public ResponseEntity<?> confirmAccount(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            // Verifica el token
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(jwtSecretConfirmation))
                    .build()
                    .verify(token);

            String email = jwt.getSubject();

            User user = userService.getUserByEmail(email);
            userService.activateUser(user);
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Account confirmed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Invalid or expired token"));
        }
    }

    @Operation(summary = "Enviar correo con QR", description = "Envía un correo electrónico con un código QR generado.")
    @PostMapping("/sendQrEmail")
    public ResponseEntity<?> sendQrEmail(@RequestBody EmailQrDto request) {
        boolean sent = emailService.sendQRCodeEmail(request.getEmail(), request.getQrText(), request.getWidth(),
                request.getHeight());
        if (sent) {
            return ResponseEntity.ok("QR enviado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar QR");
        }
    }

    @Operation(summary = "Enviar correo de restablecimiento de contraseña", description = "Envía un correo electrónico para restablecer la contraseña del usuario.")
    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody EmailResetPasswordDto email) {
        boolean sent = emailService.sendEmailResetPassword(email.getEmail());
        if (sent) {
            return ResponseEntity.ok("Email de restablecimiento de contraseña enviado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar el email");
        }
    }
}
