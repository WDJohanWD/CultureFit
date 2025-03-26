package com.culturefit.culturefit.emails.service;

public interface EmailService {
    boolean sendEmail(String destination, String subject, String textMessage);
}
