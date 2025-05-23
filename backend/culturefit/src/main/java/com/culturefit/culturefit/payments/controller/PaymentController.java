package com.culturefit.culturefit.payments.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.payments.service.PaymentService;
import com.culturefit.culturefit.services.userService.UserService;
import com.stripe.exception.StripeException;

import com.stripe.model.checkout.Session;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping("/create-checkout-session/{priceId}/{stripeId}")
    public ResponseEntity<?> createCheckoutSession(@PathVariable String priceId, @PathVariable String stripeId) throws StripeException {
        Session session = paymentService.createCheckoutSession(priceId, stripeId);
        Map<String, Object> response = new HashMap<>();
        response.put("url", session.getUrl());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-appointment-checkout-session/{priceId}/{stripeId}")
    public ResponseEntity<?> createAdviceCheckoutSession(@PathVariable String priceId, @PathVariable String stripeId) throws StripeException {
        Session session = paymentService.createAppointmentSession(priceId, stripeId);
        Map<String, Object> response = new HashMap<>();
        response.put("url", session.getUrl());
        
        User user = userService.getUserByStryipeId(stripeId);
        user.setAppointmentsAvailables(user.getAppointmentsAvailables() + 1);
        userService.saveUser(user);
        
        return ResponseEntity.ok(response);
    }
}
