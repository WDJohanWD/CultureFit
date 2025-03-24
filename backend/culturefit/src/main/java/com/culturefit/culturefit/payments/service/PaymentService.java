package com.culturefit.culturefit.payments.service;

import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

//TODO: Añadir interfaz al servicio
@Service
public class PaymentService {
    // Método para crear el checkout-session
    public Session createCheckoutSession(String priceId) throws StripeException {
        SessionCreateParams params = SessionCreateParams.builder()
            //TODO: Cambiar urls de exito y de cancelación 
            .setSuccessUrl("https://example.com/success")
            .setCancelUrl("https://example.com/cancel")
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPrice(priceId)
                    .setQuantity(1L)
                    .build()
            )
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .build();

        return Session.create(params);
    }
}
