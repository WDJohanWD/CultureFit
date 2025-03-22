package com.culturefit.culturefit.payments.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.culturefit.culturefit.payments.domain.CreateCustomerRequest;
import com.culturefit.culturefit.payments.domain.CreateSubscriptionRequest;
import com.culturefit.culturefit.payments.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-customer")
    public ResponseEntity<?> createCustomer(@RequestBody CreateCustomerRequest request) throws StripeException {

        Customer customer = paymentService.createCustomer(request);
        Map<String, Object> response = new HashMap<>();
        response.put("id", customer.getId());
        response.put("name", customer.getName());
        response.put("email", customer.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/create-subscription")
    public ResponseEntity<?> createSubscription(@RequestBody CreateSubscriptionRequest request) throws StripeException {
        Subscription subscription = paymentService.createSubscription(request);
        Map<String, Object> response = new HashMap<>();
        response.put("id", subscription.getId());
        response.put("customerId", subscription.getCustomer());
        response.put("priceId", subscription.getItems().getData().get(0).getPrice().getId());
        return ResponseEntity.ok(response);
    }

    //TODO: Completar los siguientes endpoints
    // @GetMapping("/invoice-preview")
    // public ResponseEntity<?> invoicePreview(@RequestParam String customerId, @RequestParam String newPriceId, @RequestParam String subscriptionId) throws StripeException {
    //     Map<String, Object> response = paymentService.getInvoicePreview(customerId, newPriceId, subscriptionId);
    //     return ResponseEntity.ok(response);
    // }

    // @PostMapping("/cancel-subscription")
    // public ResponseEntity<?> cancelSubscription(@RequestBody CancelSubscriptionRequest request) throws StripeException {
    //     Subscription subscription = paymentService.cancelSubscription(request.getSubscriptionId());
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("subscription", subscription);
    //     return ResponseEntity.ok(response);
    // }

    // @PostMapping("/update-subscription")
    // public ResponseEntity<?> updateSubscription(@RequestBody UpdateSubscriptionRequest request) throws StripeException {
    //     Map<String, Object> response = paymentService.updateSubscription(request);
    //     return ResponseEntity.ok(response);
    // }


    // @PostMapping("/webhook")
    // public ResponseEntity<?> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
    //     return paymentService.handleWebhook(payload, sigHeader);
    // }
}
