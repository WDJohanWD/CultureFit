package com.culturefit.culturefit.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.dto.AppointmentDto;
import com.culturefit.culturefit.services.appointmentService.AppointmentService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/appointment")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDto appointment) {
        appointmentService.saveAppointment(appointment);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/byuser/{userId}")
    public ResponseEntity <?> getMethodName(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
        return  ResponseEntity.ok(appointments);
    }
    
}
