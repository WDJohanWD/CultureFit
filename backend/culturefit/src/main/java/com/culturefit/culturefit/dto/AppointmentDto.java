package com.culturefit.culturefit.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.culturefit.culturefit.domains.AppointmentEnum;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentDto {
    private LocalDate date;
    private LocalTime time;
    private String note;
    private AppointmentEnum appointmentType;
    private Long userId;
    private Long quantity;
    private boolean isCanceled = false;
}
