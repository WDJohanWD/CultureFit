package com.culturefit.culturefit.exception.paymentExceptions;

public class StripePaymentException extends RuntimeException {
    public StripePaymentException() {
        super("Error creating payment session in Stripe");
    }
}
