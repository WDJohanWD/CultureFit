package com.culturefit.culturefit.dto;

import lombok.Data;
import com.culturefit.culturefit.domains.Role;

@Data
public class UserEditDto {
    

    private boolean active = false;

    private Role role;
}
