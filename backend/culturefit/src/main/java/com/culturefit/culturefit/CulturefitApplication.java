package com.culturefit.culturefit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class CulturefitApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

        // Pasar las variables al sistema
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );

		SpringApplication.run(CulturefitApplication.class, args);
	}
}
