package com.culturefit.culturefit.dto;

import java.time.LocalDate;

import com.culturefit.culturefit.domains.AppointmentEnum;

import lombok.Data;

@Data
public class AppointmentDto {
    private LocalDate date;
    private String note;
    private AppointmentEnum appointmentType;
    private Long userId;
}
