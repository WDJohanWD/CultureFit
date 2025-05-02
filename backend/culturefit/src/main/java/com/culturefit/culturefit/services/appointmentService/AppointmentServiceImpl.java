package com.culturefit.culturefit.services.appointmentService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.AppointmentDto;
import com.culturefit.culturefit.repositories.AppointmentRepository;
import com.culturefit.culturefit.repositories.UserRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Appointment saveAppointment(AppointmentDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow();
        Appointment appointment = new Appointment(null, dto.getDate(), user, dto.getNote(), dto.getAppointmentType());

        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    @Override
    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByUser(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return appointmentRepository.findByUser(user);
    }

}
