package com.culturefit.culturefit.payments.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

public interface PaymentService {
    Session createCheckoutSession(String priceId) throws StripeException;
}
