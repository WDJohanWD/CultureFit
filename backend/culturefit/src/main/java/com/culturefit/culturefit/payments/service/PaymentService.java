package com.culturefit.culturefit.payments.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;

public interface PaymentService {
    Session createCheckoutSession(String priceId) throws StripeException;
    Customer createCustomer(String name, String email) throws StripeException;
}
