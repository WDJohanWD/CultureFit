package com.culturefit.culturefit.emails.domain;

import lombok.Data;

@Data
public class EmailQrDto {
    private String email;
    private String qrText;
    private int width = 350;
    private int height = 350;
}
