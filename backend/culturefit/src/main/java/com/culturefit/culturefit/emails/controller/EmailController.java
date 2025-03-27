package com.culturefit.culturefit.emails.controller;

import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.culturefit.culturefit.emails.domain.EmailRequest;
import com.culturefit.culturefit.emails.domain.VerifyEmailRequest;
import com.culturefit.culturefit.emails.service.EmailService;

import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class EmailController {
    
    @Autowired
    private EmailService emailService;

    @Value("${app.jwt.secret.confirmation}")
    private String jwtSecretConfirmation;

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@Valid @RequestBody EmailRequest request, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos inválidos en la solicitud");
        }

        emailService.sendEmail(request.getEmail(), request.getSubject(), request.getTextMessage());
        return ResponseEntity.status(HttpStatus.OK).body("Email enviado correctamente");
    }

    @PostMapping("/verification-email")
    public ResponseEntity<?> sendVerifyEmail(@RequestBody VerifyEmailRequest request, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos inválidos en la solicitud");
        }

        // Falta

        emailService.sendConfirmationEmail(request.getEmail());
        return ResponseEntity.ok("Email enviado correctamente");
    }

    @PostMapping("/confirm-account")
    public ResponseEntity<?> confirmAccount(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            // Verifica el token
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(jwtSecretConfirmation))
                .build()
                .verify(token);
            
            String email = jwt.getSubject();
            
            System.out.println("Funciona me cago en dios" + email);
            
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Account confirmed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "Invalid or expired token"));
        }
    }
}
