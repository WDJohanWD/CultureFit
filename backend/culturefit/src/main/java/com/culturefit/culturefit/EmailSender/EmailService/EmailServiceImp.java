package com.culturefit.culturefit.EmailSender.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImp implements EmailService{
   
    private final String email = "culturefit.contact@a23johanfav.iesteis.gal";
    @Autowired
    private JavaMailSender sender;

    @Override
    public boolean sendEmail(String destination, String subject, String textMessage) {
        try { 
            MimeMessage message = sender.createMimeMessage(); 
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(email); 
            helper.setTo(destination); 
            helper.setText(textMessage, true); 
            helper.setSubject(subject); 
            sender.send(message); 
            return true; 
        } catch (MessagingException e) { e.printStackTrace();  return false;        } 
    }
}
