package com.culturefit.culturefit.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.culturefit.culturefit.domains.AppointmentEnum;

import lombok.Data;

@Data
public class AppointmentDto {
    private LocalDate date;
    private LocalTime time;
    private String note;
    private AppointmentEnum appointmentType;
    private Long userId;
    private boolean isCanceled = false;
}
