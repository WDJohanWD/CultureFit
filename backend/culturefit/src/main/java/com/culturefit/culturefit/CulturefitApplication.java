package com.culturefit.culturefit;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.culturefit.culturefit.payments.service.PaymentService;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class CulturefitApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

        // Pasar las variables al sistema
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );

		SpringApplication.run(CulturefitApplication.class, args);
	}

    @Bean
    CommandLineRunner initData(PaymentService paymentService){
        return _ -> {
            System.out.println(paymentService.listarProductos());
        };
    }
}
