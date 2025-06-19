package com.culturefit.culturefit.emails.service;

import java.util.Date;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender sender;

    @Value("${app.jwt.secret.confirmation}")
    private String jwtSecretConfirmation;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${api.url.front}")
    private String frontUrl;


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

        String confirmationUrl = frontUrl + "/confirm-account/" + token;


        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Confirm your CultureFit account");
            helper.setText(
                    "<div style='background-color: #FF5400; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center;'>"
                            + "<img src='cid:imageId' alt='Logo CultureFit' style='width:70px; height:auto;  margin-right: 5px;'/>"
                            + "<h1 style='color: white; font-family: Montserrat, Arial, sans-serif; margin: 0;'>CultureFit</h1>"
                            + "</div>"
                            + "<div style='padding: 20px; font-family: Montserrat, Arial, sans-serif; text-align: center;'>"
                            + "<p style='font-size: 16px; color: #333;'>Click the following link to create your account in CultureFit:</p>"
                            + "<a href='" + confirmationUrl
                            + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #FF5400; text-decoration: none; border-radius: 5px; font-weight: bold; font-family: Montserrat, Arial, sans-serif;'>Confirm account</a>"
                            + "</div>",
                    true);
            ClassPathResource image = new ClassPathResource("imgs/CultureFitLogoBlanco.png");
            helper.addInline("imageId", image);

            sender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean sendQRCodeEmail(String toEmail, String text, int width, int height) {
        try {
            BufferedImage qrImage = generateQRCode(text, width, height);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            byte[] imageBytes = baos.toByteArray();

            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Detalles de tu cita en CultureFit");

            helper.setText(
                    "<div style='background-color: #FF5400; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center;'>"
                            + "<img src='cid:imageId' alt='Logo CultureFit' style='width:70px; height:auto; margin-right: 5px;'/>"
                            + "<h1 style='color: white; font-family: Montserrat, Arial, sans-serif; margin: 0;'>CultureFit</h1>"
                            + "</div>"
                            + "<div style='padding: 20px; font-family: Montserrat, Arial, sans-serif; text-align: center;'>"
                            + "<p style='font-size: 16px; color: #333;'>Escanea el siguiente código QR para ver los detalles de tu cita:</p>"
                            + "<img src='cid:qrCodeImage' style='width:250px;height:auto;margin-top:15px;'/>"
                            + "</div>",
                    true);

            ClassPathResource image = new ClassPathResource("imgs/CultureFitLogoBlanco.png");
            helper.addInline("imageId", image);

            helper.addInline("qrCodeImage", new ByteArrayDataSource(imageBytes, "image/png"));

            sender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean sendEmailResetPassword(String toEmail) {
        String token = generateToken(toEmail);
        String resetUrl = apiUrl + "/reset-password/" + token;

        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Reset your CultureFit password");
            helper.setText(
                    "<div style='background-color: #FF5400; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center;'>"
                            + "<img src='cid:imageId' alt='Logo CultureFit' style='width:70px; height:auto; margin-right: 5px;'/>"
                            + "<h1 style='color: white; font-family: Montserrat, Arial, sans-serif; margin: 0;'>CultureFit</h1>"
                            + "</div>"
                            + "<div style='padding: 20px; font-family: Montserrat, Arial, sans-serif; text-align: center;'>"
                            + "<p style='font-size: 16px; color: #333;'>Click the following link to reset your password:</p>"
                            + "<a href='" + resetUrl
                            + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #FF5400; text-decoration: none; border-radius: 5px; font-weight: bold; font-family: Montserrat, Arial, sans-serif;'>Reset password</a>"
                            + "</div>",
                    true);
            ClassPathResource image = new ClassPathResource("imgs/CultureFitLogoBlanco.png");
            helper.addInline("imageId", image);

            sender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public BufferedImage generateQRCode(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
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
