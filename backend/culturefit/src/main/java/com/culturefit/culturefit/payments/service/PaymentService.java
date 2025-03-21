package com.culturefit.culturefit.payments.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domain.Usuario;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.model.ProductCollection;
import com.stripe.model.Subscription;
import com.stripe.model.financialconnections.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import com.stripe.param.ProductListParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.financialconnections.SessionCreateParams;


@Service
public class PaymentService {
    public Product crearProducto(String nombre, String descripcion) throws StripeException{
        ProductCreateParams params = ProductCreateParams.builder()
            .setName(nombre)
            .setDescription(descripcion)
            .build();

        Product product = Product.create(params);
        return product;
    }

    public Price crearPrecio(String moneda, Long precio, String productId) throws StripeException{
        PriceCreateParams params = PriceCreateParams.builder()
            .setCurrency(moneda)
            .setUnitAmount(precio)
            .setRecurring(
                PriceCreateParams.Recurring.builder()
                    .setInterval(PriceCreateParams.Recurring.Interval.MONTH)
                    .build()
            )
            .setProduct(productId)
            .build();
        Price price = Price.create(params);
        return price;
    }

    public Customer crearCliente(Usuario usuario) throws StripeException{
        CustomerCreateParams params = CustomerCreateParams.builder()
            .setName(usuario.getNombre())
            .setEmail(usuario.getEmail())
            .build();
        Customer customer = Customer.create(params);

        return customer;
    }

    public Subscription crearSubscripcion(String clienteId, String priceId) throws StripeException{
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
            .setCustomer(clienteId)
            .addItem(
                SubscriptionCreateParams.Item.builder()
                    .setPrice(priceId)
                    .build()
                )
            .build();
        Subscription subscription = Subscription.create(params);

        return subscription;
    }

    public Session crearSesionPago(String clienteId) throws StripeException{
        SessionCreateParams params = SessionCreateParams.builder()
        .setAccountHolder(
            SessionCreateParams.AccountHolder.builder()
                .setType(SessionCreateParams.AccountHolder.Type.CUSTOMER)
                .setCustomer(clienteId)
                .build()
            )
        .addPermission(SessionCreateParams.Permission.PAYMENT_METHOD)
        .addPermission(SessionCreateParams.Permission.BALANCES)
        .setFilters(SessionCreateParams.Filters.builder().addCountry("ES").build())
        .build();

        Session session = Session.create(params);

      return session;
    }

    public List<Product> listarProductos() throws StripeException{
        ProductListParams params = ProductListParams.builder().setLimit(3L).build();
        ProductCollection products = Product.list(params);

        List<Product> productList = products.getData().stream().collect(Collectors.toList());

        return productList;
    }

}
