package com.culturefit.culturefit.payments.service;

import java.util.Map;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;

public interface PaymentService {
    Session createCheckoutSession(String priceId, String email) throws StripeException;
    Customer createCustomer(String name, String email) throws StripeException;
    Session createAppointmentSession(String priceId, String stripeId, Long quantity, Map<String, String> metadata) throws StripeException;
}
