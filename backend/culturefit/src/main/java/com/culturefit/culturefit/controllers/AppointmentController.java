package com.culturefit.culturefit.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.domains.AppointmentEnum;
import com.culturefit.culturefit.dto.AppointmentAvailableDto;
import com.culturefit.culturefit.dto.AppointmentDto;
import com.culturefit.culturefit.services.appointmentService.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDto appointment) {
        Appointment appointmentSave = appointmentService.saveAppointment(appointment);
        return ResponseEntity.ok(appointmentSave);
    }

    @GetMapping("/byuser/{userId}")
    public ResponseEntity<?> getMethodName(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/services")
    public ResponseEntity<?> getServices() {

        return ResponseEntity.ok(AppointmentEnum.values());
    }

    @GetMapping("/slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalTime> slots = appointmentService.getAvailableSlots(date);
        return ResponseEntity.ok(slots);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/manageAppointment")
    public ResponseEntity<?> manageAppointment(@RequestBody AppointmentAvailableDto dto) {
        appointmentService.manageAppointment(dto);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
