package com.culturefit.culturefit.emails.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService{
   
    @Autowired
    private JavaMailSender sender;

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
        } catch (MessagingException e) { e.printStackTrace(); return false; }
    }
}
