package com.culturefit.culturefit.payments.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.culturefit.culturefit.payments.service.PaymentService;
import com.stripe.exception.StripeException;

import com.stripe.model.checkout.Session;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-checkout-session/{priceId}")
    public ResponseEntity<?> createCheckoutSession(@PathVariable String priceId) throws StripeException {
        Session session = paymentService.createCheckoutSession(priceId);
        Map<String, Object> response = new HashMap<>();
        response.put("id", session.getId());
        response.put("url", session.getUrl());
        return ResponseEntity.ok(response);
    }
}
