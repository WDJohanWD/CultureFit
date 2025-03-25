package com.culturefit.culturefit.EmailSender.EmailController;

import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.EmailSender.EmailDomain.EmailRequest;
import com.culturefit.culturefit.EmailSender.EmailService.EmailService;
import com.culturefit.culturefit.domain.User;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class EmailController {
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@Valid @RequestBody EmailRequest request, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos inválidos en la solicitud");
        }

        emailService.sendEmail(request.getEmail(), request.getSubject(), request.getTextMessage());
        return ResponseEntity.status(HttpStatus.OK).body("Email enviado correctamente");
    }
}
