package com.culturefit.culturefit.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.culturefit.culturefit.security.AuthTokenFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private UserDetailsService userDetailsService;

    // Filtro de autenticación que intercepta las solicitudes para validar el JWT
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    // Proveedor de autenticación basado en DAO, que recupera los detalles del usuario desde la base de datos
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Administrador de autenticación que gestiona los procesos de login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Codificador de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //TODO: Configurar los requestMatchers
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas (acceso sin autenticación)
                        // .requestMatchers("/", "/memberships", "/aboutus", "/confirm-account/**", "/reset-password/**", "/profile/**", "/payment-success", "/payment-error", "/signup", "/login", "/error").permitAll()

                        // Rutas solo para usuarios autenticados (USER, SUBSCRIBER, ADMIN)
                        // .requestMatchers("/lessons", "/appointment", "/appointment/**", "/your-progress", "/workout").hasAnyRole("USER", "SUBSCRIBER", "ADMIN")

                        // Rutas solo para administradores
                        // .requestMatchers("/admin").hasRole("ADMIN")

                        // Cualquier otra ruta requiere autenticación
                        // .anyRequest().authenticated()

                        // Temporal: Permitir todas las solicitudes sin autenticación
                        .anyRequest().permitAll()
                )
                .csrf(csrf -> csrf.disable()); // Opcional: Deshabilita CSRF si usas APIs públicas
        return http.build();
    }
}
