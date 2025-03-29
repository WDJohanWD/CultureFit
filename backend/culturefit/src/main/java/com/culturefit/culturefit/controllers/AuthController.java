package com.culturefit.culturefit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.culturefit.culturefit.repositories.UserRepository;
import com.culturefit.culturefit.security.JwtUtils;
import com.culturefit.culturefit.security.domain.UserDetailsImpl;
import com.culturefit.culturefit.security.dto.JwtResponseDto;
import com.culturefit.culturefit.security.dto.LoginDto;
import com.culturefit.culturefit.security.dto.SignupDto;

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
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getName(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("ERROR");
        return ResponseEntity.ok(new JwtResponseDto(jwt, "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupDto signUpRequest) {
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
        // Crear nueva cuenta de usuario
        User user = new User(
            null,
            signUpRequest.getName(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()),
            signUpRequest.getBirthDate(),
            false,
            null,
            Role.USER
        );
        userRepository.save(user);
        return ResponseEntity.ok("Successfully registered user");
    }
}
