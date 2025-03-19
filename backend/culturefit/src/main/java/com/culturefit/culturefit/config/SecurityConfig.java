package com.culturefit.culturefit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/v3/api-docs/**",    // Documentación de API
                    "/swagger-ui/**",     // Interfaz Swagger UI
                    "/swagger-ui.html",   // Página principal de Swagger
                    "/webjars/**"         // Recursos estáticos de Swagger
                ).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(withDefaults())
            .logout(withDefaults());
        return http.build();
    }
}
