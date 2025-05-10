package com.culturefit.culturefit.services.appointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.AppointmentAvailableDto;
import com.culturefit.culturefit.dto.AppointmentDto;

public interface AppointmentService {
    Appointment saveAppointment(AppointmentDto appointmentDto);

    Appointment getAppointmentById(Long id);

    Appointment updateAppointment(Appointment appointment);

    void deleteAppointment(Long id);

    List<Appointment> getAppointmentsByUser(Long id);

    List<LocalTime> getAvailableSlots(LocalDate date);

    List<Appointment> getAllAppointments();

    User manageAppointment(AppointmentAvailableDto dto);

}
