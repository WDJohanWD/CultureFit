package com.culturefit.culturefit.payments.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Configuration
public class StripeConfig {
    @Value("${stripe.secret.key}")
        private String stripeKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeKey;
    }
}