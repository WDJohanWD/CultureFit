package com.culturefit.culturefit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.Role;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.payments.service.PaymentService;
import com.culturefit.culturefit.repositories.UserRepository;
import com.culturefit.culturefit.security.JwtUtils;
import com.culturefit.culturefit.security.domain.UserDetailsImpl;
import com.culturefit.culturefit.security.dto.JwtResponseDto;
import com.culturefit.culturefit.security.dto.LoginDto;
import com.culturefit.culturefit.security.dto.SignupDto;
import com.culturefit.culturefit.services.userService.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        try {
            User user = userService.getUserByEmail(loginDto.getEmail());
            System.out.println(user);
            if (user.isActive()) {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getName(), loginDto.getPassword()));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                String role = userDetails.getAuthorities().stream().findFirst().map(a -> a.getAuthority())
                        .orElse("ERROR");
                return ResponseEntity.ok(new JwtResponseDto(jwt, "Bearer",
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        role));
            } else {
                System.out.println("ERROR");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("El usuario no esta activo");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupDto signUpRequest) throws StripeException {
        if (userRepository.existsByName(signUpRequest.getName())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: A user with that name already exists");
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: A user with that email already exists");
        }

        Customer stripeUser = paymentService.createCustomer(signUpRequest.getName(), signUpRequest.getEmail());

        // Crear nueva cuenta de usuario
        User user = new User(
                null,
                signUpRequest.getDni(),
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getBirthDate(),
                false,
                null,
                Role.USER,
                signUpRequest.getAppointmentsAvailables(),
                stripeUser.getId());

        userRepository.save(user);
        return ResponseEntity.ok("Successfully registered user");
    }
}
