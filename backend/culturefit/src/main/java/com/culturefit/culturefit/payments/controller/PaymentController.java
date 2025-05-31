package com.culturefit.culturefit.payments.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.culturefit.culturefit.payments.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-checkout-session/{priceId}/{stripeId}")
    public ResponseEntity<?> createCheckoutSession(@PathVariable String priceId, @PathVariable String stripeId)
            throws StripeException {
        Session session = paymentService.createCheckoutSession(priceId, stripeId);
        Map<String, Object> response = new HashMap<>();
        response.put("url", session.getUrl());
        return ResponseEntity.ok(response);
    }

    // TODO: CAMBIAR LA IP EN PRODUCCION A LA IP DEL SERVIDOR
    @PostMapping("/api/stripe/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        return paymentService.handleStripeWebhook(payload, sigHeader);
    }

    // @PostMapping("/create-appointment-checkout-session/{priceId}/{stripeId}")
    // public ResponseEntity<?> createAdviceCheckoutSession(@PathVariable String
    // priceId, @PathVariable String stripeId) throws StripeException {
    // Session session = paymentService.createAppointmentSession(priceId, stripeId);
    // Map<String, Object> response = new HashMap<>();
    // response.put("url", session.getUrl());

    // User user = userService.getUserByStryipeId(stripeId);
    // user.setAppointmentsAvailables(user.getAppointmentsAvailables() + 1);
    // userService.saveUser(user);

    // return ResponseEntity.ok(response);
    // }
}
