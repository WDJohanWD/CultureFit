package com.culturefit.culturefit.payments.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.culturefit.culturefit.payments.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Controlador de pagos", description = "Controlador para gestionar los distintos pagos.")
@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Operation(summary = "Crear una sesión de pago", description = "Crea una sesión de pago en Stripe.")
    @Parameter(name = "priceId", description = "Id del precio", required = true)
    @Parameter(name = "stripeId", description = "Id del cliente en Stripe", required = true)
    @PostMapping("/create-checkout-session/{priceId}/{stripeId}")
    public ResponseEntity<?> createCheckoutSession(@PathVariable String priceId, @PathVariable String stripeId)
            throws StripeException {
        Session session = paymentService.createCheckoutSession(priceId, stripeId);
        Map<String, Object> response = new HashMap<>();
        response.put("url", session.getUrl());
        return ResponseEntity.ok(response);
    }

    // TODO: CAMBIAR LA IP EN PRODUCCION A LA IP DEL SERVIDOR
    @Operation(summary = "Manejo webhook", description = "Maneja los eventos de webhook de Stripe.")
    // @PostMapping("/api/stripe/webhook")
    // public ResponseEntity<String> handleStripeWebhook(
    //         @RequestBody String payload,
    //         @RequestHeader("Stripe-Signature") String sigHeader) {
    //     return paymentService.handleStripeWebhook(payload, sigHeader);
    // }

    @PostMapping("/api/stripe/webhook")
        public ResponseEntity<String> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        // Lógica para verificar la firma y procesar el evento
        return ResponseEntity.ok("");
    }
}
