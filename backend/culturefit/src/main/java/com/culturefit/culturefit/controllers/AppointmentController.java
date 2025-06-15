package com.culturefit.culturefit.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.culturefit.culturefit.domains.Appointment;
import com.culturefit.culturefit.domains.AppointmentEnum;
import com.culturefit.culturefit.domains.User;
import com.culturefit.culturefit.dto.AppointmentDto;
import com.culturefit.culturefit.dto.CouponDto;
import com.culturefit.culturefit.payments.service.PaymentService;
import com.culturefit.culturefit.services.appointmentService.AppointmentService;
import com.culturefit.culturefit.services.userService.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Controlador de citas", description = "Controlador para gestionar las citas.")
@RestController
@RequestMapping("/appointment")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Operation(summary = "Obtener todas las citas", description = "Devuelve una lista con todas las citas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas obtenida exitosamente", content = @Content(schema = @Schema(implementation = Appointment.class))),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/all")
    public ResponseEntity<?> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @Operation(summary = "Obtener una cita por ID", description = "Devuelve los datos de una cita por su ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita encontrada exitosamente", content = @Content(schema = @Schema(implementation = Appointment.class))),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id de la cita", required = true)
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @Operation(summary = "Obtener citas por usuario", description = "Devuelve una lista de citas para un usuario específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de citas obtenida exitosamente", content = @Content(schema = @Schema(implementation = Appointment.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "userId", description = "Id del usuario", required = true)
    @GetMapping("/byuser/{userId}")
    public ResponseEntity<?> getAppointmentsByUser(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
        return ResponseEntity.ok(appointments);
    }

    @Operation(summary = "Obtener servicios disponibles", description = "Devuelve una lista de servicios disponibles para citas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de servicios obtenida exitosamente", content = @Content(schema = @Schema(implementation = AppointmentEnum.class))),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services")
    public ResponseEntity<?> getServices() {
        return ResponseEntity.ok(AppointmentEnum.values());
    }

    @Operation(summary = "Obtener horarios disponibles", description = "Devuelve una lista de horarios disponibles para una fecha específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de horarios obtenida exitosamente", content = @Content(schema = @Schema(implementation = LocalTime.class))),
            @ApiResponse(responseCode = "400", description = "Fecha inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalTime> slots = appointmentService.getAvailableSlots(date);
        return ResponseEntity.ok(slots);
    }

    @Operation(summary = "Cancela la cita", description = "Cancela una cita existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cita cancelada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Parameter(name = "id", description = "Id de la cita", required = true)
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Comprar cupón de cita", description = "Compra un cupón para luego canjear una cita.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cupón comprado exitosamente", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos de compra inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/buy-coupon")
    public ResponseEntity<?> buyCoupon(@RequestBody CouponDto couponDto) throws StripeException {
        User user = userService.getUser((couponDto.getUserId()));
        Session session = paymentService.createAppointmentSession(
                "price_1RQH482esfOHTwEz0wO1msLd",
                user.getStripeId(),
                String.valueOf(couponDto.getQuantity()));

        Map<String, Object> response = new HashMap<>();
        response.put("checkoutUrl", session.getUrl());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Canjear cita", description = "Crea una cita y la canjea para el usuario.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cita canjeada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de cita inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/create-appointment")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDto appointmentDto) {
        Appointment appointment = appointmentService.saveAppointment(appointmentDto);
        boolean sent = appointmentService.redeemAppointment(appointment.getUser().getId(), appointment.getId(),
                appointment.getUser().getEmail());
        if (sent) {
            return ResponseEntity.ok(
                    "Cita canjeada correctamente, mire la bandeja de entrada de su correo para obtener el código QR");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al canjear la cita");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cita", description = "Elimina una cita por su ID.")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}