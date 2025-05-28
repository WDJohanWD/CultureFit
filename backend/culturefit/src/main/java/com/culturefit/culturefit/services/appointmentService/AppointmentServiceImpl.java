package com.culturefit.culturefit.services.appointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.AppointmentAvailableDto;
import com.culturefit.culturefit.dto.AppointmentDto;
import com.culturefit.culturefit.payments.service.PaymentService;
import com.culturefit.culturefit.repositories.AppointmentRepository;
import com.culturefit.culturefit.repositories.UserRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PaymentService paymentService;

    private static final LocalTime START_TIME = LocalTime.of(9, 0);
    private static final LocalTime END_TIME = LocalTime.of(17, 30);
    private static final int SLOT_DURATION_MINUTES = 30;

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Appointment saveAppointment(AppointmentDto dto) {
        try {
            User user = userRepository.findById(dto.getUserId()).orElseThrow();
            paymentService.createAppointmentSession("price_1RQH482esfOHTwEz0wO1msLd", user.getStripeId());
            Appointment appointment = new Appointment(null, dto.getDate(), dto.getTime(), user, dto.getNote(),
                    dto.getAppointmentType(), dto.isCanceled());

                    
            return appointmentRepository.save(appointment);
        
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
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
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        appointment.setCanceled(true);
        appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAppointmentsByUser(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return appointmentRepository.findByUser(user);
    }

    @Override
    public List<LocalTime> getAvailableSlots(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDate(date);
        Set<LocalTime> reservedTimes = appointments.stream()
                .map(Appointment::getTime)
                .collect(Collectors.toSet());

        List<LocalTime> availableSlots = new ArrayList<>();
        LocalTime current = START_TIME;

        while (!current.isAfter(END_TIME.minusMinutes(SLOT_DURATION_MINUTES))) {
            if (!reservedTimes.contains(current)) {
                availableSlots.add(current);
            }
            current = current.plusMinutes(SLOT_DURATION_MINUTES);
        }

        return availableSlots;
    }

    @Override
    public User manageAppointment(AppointmentAvailableDto dto) {
        Long userId = dto.getId();
        User user = userRepository.findById(userId).orElseThrow();
        int newAppointmentAvailable = user.getAppointmentsAvailables() + dto.getNum();
        user.setAppointmentsAvailables(newAppointmentAvailable);
        return  userRepository.save(user);
    }
}
