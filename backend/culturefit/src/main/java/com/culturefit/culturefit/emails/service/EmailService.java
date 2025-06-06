package com.culturefit.culturefit.emails.service;

import java.awt.image.BufferedImage;

public interface EmailService {
    boolean sendEmail(String destination, String subject, String textMessage);

    boolean sendConfirmationEmail(String toEmail);

    boolean sendQRCodeEmail(String toEmail, String text, int width, int height);

    boolean sendEmailResetPassword(String toEmail);

    BufferedImage generateQRCode(String text, int width, int height) throws Exception;

    String generateToken(String email);
}
