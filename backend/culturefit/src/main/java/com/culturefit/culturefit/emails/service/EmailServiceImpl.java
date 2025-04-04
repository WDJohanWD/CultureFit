package com.culturefit.culturefit.emails.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender sender;

    @Value("${app.jwt.secret.confirmation}")
    private String jwtSecretConfirmation;

    @Override
    public boolean sendEmail(String destination, String subject, String textMessage) {
        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(destination);
            helper.setText(textMessage, true);
            helper.setSubject(subject);
            sender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean sendConfirmationEmail(String toEmail) {
        String token = generateToken(toEmail);
        String confirmationUrl = "http://localhost:5173/confirm-account/" + token;

        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Confirm your CultureFit account");
            helper.setText("<div style='background-color: #FF5400; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center;'>"
                    + "<img src='cid:imageId' alt='Logo CultureFit' style='width:70px; height:auto;  margin-right: 5px;'/>"
                    + "<h1 style='color: white; font-family: Montserrat, Arial, sans-serif; margin: 0;'>CultureFit</h1>"
                    + "</div>"
                    + "<div style='padding: 20px; font-family: Montserrat, Arial, sans-serif; text-align: center;'>"
                    + "<p style='font-size: 16px; color: #333;'>Click the following link to create your account in CultureFit:</p>"
                    + "<a href='" + confirmationUrl
                    + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #FF5400; text-decoration: none; border-radius: 5px; font-weight: bold; font-family: Montserrat, Arial, sans-serif;'>Confirm account</a>"
                    + "</div>", true);
            ClassPathResource image = new ClassPathResource("imgs/CultureFitLogoBlanco.png");
            helper.addInline("imageId", image);

            sender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Para generar el tokem de JWT solo para el correo
    @Override
    public String generateToken(String email) {
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600000))
                .sign(Algorithm.HMAC256(jwtSecretConfirmation));
    }
}
