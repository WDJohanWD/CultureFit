package com.culturefit.culturefit.services.appointmentService;

import java.util.List;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.AppointmentDto;

public interface AppointmentService {
    Appointment saveAppointment(AppointmentDto appointmentDto);
    Appointment getAppointmentById(Long id);
    Appointment updateAppointment(Appointment appointment);
    void deleteAppointment(Long id);
    List<Appointment> getAppointmentsByUser(Long id);
}
