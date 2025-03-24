package com.culturefit.culturefit.EmailSender.EmailService;

public interface EmailService {
    boolean sendEmail(String destination, String subject, String textMessage);
}
