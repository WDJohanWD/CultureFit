package com.culturefit.culturefit.payments.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.exceptions.paymentExceptions.StripePaymentException;
import com.culturefit.culturefit.repositories.UserRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class PaymentServiceImpl implements PaymentService{
    @Autowired
    private UserRepository userRepository;

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

    public Session createAppointmentSession(String priceId, String stripeId, String quantity) throws StripeException {
        try {
            User user = userRepository.findByStripeId(stripeId).orElseThrow();
            SessionCreateParams params = SessionCreateParams.builder()
                //TODO: Cambiar urls de exito y de cancelación 
                .setSuccessUrl("https://example.com/success")
                .setCancelUrl("https://example.com/cancel")
                .addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(Long.parseLong(quantity))
                        .build()
                )
                .setCustomer(stripeId)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .putMetadata("userId", String.valueOf(user.getId()))
                .putMetadata("quantity", quantity)
                .build();
            
            return Session.create(params);
        } catch (Exception e) {
            throw new StripePaymentException();
        }
    }

    public ResponseEntity<String> handleStripeWebhook(String payload, String sigHeader) {
        
        String endpointSecret = "whsec_AMfHCF0RBHSOTJQeEwekmvcNpiUD9hq9";
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Firma inválida");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElse(null);

            if (session != null) {
                Long userId = Long.parseLong(session.getMetadata().get("userId"));
                int quantity = Integer.parseInt(session.getMetadata().get("quantity"));

                User user = userRepository.findById(userId).orElseThrow();
                user.setAppointmentsAvailables(user.getAppointmentsAvailables() + quantity);
                userRepository.save(user);
            }
        }

        return ResponseEntity.ok("");
    }
}
