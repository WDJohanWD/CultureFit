package com.culturefit.culturefit.payments.config;

import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Configuration
public class StripeConfig {
    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.load();
        String stripeKey = dotenv.get("STRIPE_SECRET_KEY");
        Stripe.apiKey = stripeKey;
    }
}