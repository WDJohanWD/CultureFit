package com.culturefit.culturefit.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponseDto {
    private String accessToken;
    private String tokenType;
    private Long id;
    private String name;
    private String email;
    private String role;
}