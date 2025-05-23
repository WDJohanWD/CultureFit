package com.culturefit.culturefit.payments.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;

public interface PaymentService {
    Session createCheckoutSession(String priceId, String email) throws StripeException;
    Customer createCustomer(String name, String email) throws StripeException;
    Session createAppointmentSession(String priceId, String stripeId) throws StripeException;
}
