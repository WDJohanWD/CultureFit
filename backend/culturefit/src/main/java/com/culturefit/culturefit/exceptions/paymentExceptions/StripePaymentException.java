package com.culturefit.culturefit.exceptions.paymentExceptions;

public class StripePaymentException extends RuntimeException {
    public StripePaymentException() {
        super("Error creating payment session in Stripe");
    }
}
