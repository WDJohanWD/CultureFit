package com.culturefit.culturefit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // Permitir TODAS las solicitudes sin autenticación
            )
            .csrf(csrf -> csrf.disable()); // Opcional: Deshabilita CSRF si usas APIs públicas
        return http.build();
    }
}
