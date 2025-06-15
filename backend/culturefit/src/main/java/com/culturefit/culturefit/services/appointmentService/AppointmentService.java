package com.culturefit.culturefit.services.appointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.dto.AppointmentDto;

public interface AppointmentService {
    Appointment saveAppointment(AppointmentDto appointmentDto);

    Appointment getAppointmentById(Long id);

    Appointment updateAppointment(Appointment appointment);

    public void totalDeleteAppointment(Long id);

    void cancelAppointment(Long id);

    void deleteAppointment(Long id);

    boolean redeemAppointment(Long userId, Long appointmentId, String email);

    List<Appointment> getAppointmentsByUser(Long id);

    List<LocalTime> getAvailableSlots(LocalDate date);

    List<Appointment> getAllAppointments();
}
