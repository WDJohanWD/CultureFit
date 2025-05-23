package com.culturefit.culturefit.payments.service;

import org.springframework.stereotype.Service;

import com.culturefit.culturefit.exceptions.paymentExceptions.StripePaymentException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class PaymentServiceImpl implements PaymentService{
    // Método para crear el usuario de Stripe
    public Customer createCustomer(String name, String email) throws StripeException {
        CustomerCreateParams params = 
            CustomerCreateParams.builder()
                .setName(name)
                .setEmail(email)
                .build();

        Customer customer = Customer.create(params);

        return customer;
    }

    // Método para crear el checkout-session
    public Session createCheckoutSession(String priceId, String stripeId) throws StripeException {
        try {
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
                .setCustomer(stripeId)
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .build();
            return Session.create(params);
        } catch (Exception e) {
            throw new StripePaymentException();
        }
    }

    public Session createAppointmentSession(String priceId, String stripeId) throws StripeException {
        try {
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
                .setCustomer(stripeId)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .build();
            return Session.create(params);
        } catch (Exception e) {
            throw new StripePaymentException();
        }
    }
}
