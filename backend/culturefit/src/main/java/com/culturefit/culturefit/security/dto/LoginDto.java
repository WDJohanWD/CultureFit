package com.culturefit.culturefit.security.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    @NotBlank
    private String name;
    @NotBlank
    private String password;
}
