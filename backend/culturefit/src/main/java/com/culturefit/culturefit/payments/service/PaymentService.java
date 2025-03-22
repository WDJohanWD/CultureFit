package com.culturefit.culturefit.payments.service;

import java.util.Arrays;

import org.springframework.stereotype.Service;

import com.culturefit.culturefit.payments.domain.CreateCustomerRequest;
import com.culturefit.culturefit.payments.domain.CreateSubscriptionRequest;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.InvoiceUpcomingParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.checkout.SessionCreateParams;


@Service
public class PaymentService {
    
    public Customer createCustomer(CreateCustomerRequest request) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
            .setName(request.getName())
            .setEmail(request.getEmail())
            .build();

        return Customer.create(params);
        
    }

    public Subscription createSubscription(CreateSubscriptionRequest request) throws StripeException {
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
            .setCustomer(request.getCustomerId())
            .addItem(SubscriptionCreateParams.Item.builder().setPrice(request.getPriceId()).build())
            .setPaymentBehavior(SubscriptionCreateParams.PaymentBehavior.DEFAULT_INCOMPLETE)
            .addAllExpand(Arrays.asList("latest_invoice.payment_intent"))
            .build();

        return Subscription.create(params);
    }

    public Session createCheckoutSession(String priceId) throws StripeException {
        SessionCreateParams params = SessionCreateParams.builder()
            //TODO: Cambiar las urls por unas válidas
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


    // TODO: Realizar metodos de cancelación y actualizacion de subscripcion
    // public Subscription cancelSubscription(String subscriptionId) throws StripeException {
    //     Subscription subscription = Subscription.retrieve(subscriptionId);
    //     return subscription.cancel();
    // }

    // public Subscription updateSubscription(String subscriptionId, String newPriceId) throws StripeException {
    //     Subscription subscription = Subscription.retrieve(subscriptionId);
    //     SubscriptionUpdateParams params = SubscriptionUpdateParams.builder()
    //             .addItem(SubscriptionUpdateParams.Item.builder()
    //                     .setId(subscription.getItems().getData().get(0).getId())
    //                     .setPrice(newPriceId)
    //                     .build())
    //             .setCancelAtPeriodEnd(false)
    //             .build();
    //     return subscription.update(params);
    // }
    
    public Invoice getInvoicePreview(String subscriptionId) throws StripeException {
        Subscription subscription = Subscription.retrieve(subscriptionId);

        InvoiceUpcomingParams params = InvoiceUpcomingParams.builder()
                .setCustomer(subscription.getCustomer())
                .setSubscription(subscriptionId)
                .addSubscriptionItem(InvoiceUpcomingParams.SubscriptionItem.builder()
                        .setId(subscription.getItems().getData().get(0).getId())
                        .setPrice(subscription.getItems().getData().get(0).getPrice().getId())
                        .build())
                .build();
        return Invoice.upcoming(params);
    }

    public String handleWebhook(String payload, String sigHeader) {
        String endpointSecret = "your_webhook_secret";
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            System.out.println(event.getObject());
        } catch (SignatureVerificationException e) {
            return "Invalid signature";
        }
        return "Webhook received";
    }
}
