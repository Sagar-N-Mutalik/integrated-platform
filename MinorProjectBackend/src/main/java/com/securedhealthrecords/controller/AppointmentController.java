package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.Appointment;
import com.securedhealthrecords.repository.AppointmentRepository;
import com.securedhealthrecords.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> bookAppointment(@RequestBody Appointment appointment, Authentication auth) {
        appointment.setPatientId(auth.getName());
        appointment.setStatus("PENDING");
        appointment.setIsPaid(false);
        appointment.setReminderSent(false);
        appointment.setCreatedAt(LocalDateTime.now().toString());
        appointment.setUpdatedAt(LocalDateTime.now().toString());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send appointment request email to doctor
        appointmentService.sendAppointmentRequest(savedAppointment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Appointment request sent successfully");
        response.put("appointment", savedAppointment);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication auth) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(auth.getName());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/accepted-appointments")
    public ResponseEntity<List<Appointment>> getAcceptedAppointments(Authentication auth) {
        List<Appointment> appointments = appointmentService.getAcceptedAppointments(auth.getName());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        return appointment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Map<String, Object>> acceptAppointment(@PathVariable String id) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus("ACCEPTED");
            appointment.setUpdatedAt(LocalDateTime.now().toString());
            Appointment updated = appointmentRepository.save(appointment);
            
            // Send confirmation email to patient
            appointmentService.sendAppointmentConfirmation(updated);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment accepted successfully");
            response.put("appointment", updated);
            
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectAppointment(@PathVariable String id) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus("REJECTED");
            appointment.setUpdatedAt(LocalDateTime.now().toString());
            Appointment updated = appointmentRepository.save(appointment);
            
            // Send rejection email to patient
            appointmentService.sendAppointmentRejection(updated);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment rejected");
            response.put("appointment", updated);
            
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable String id, 
            @RequestParam String status) {
        
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            appointment.setUpdatedAt(LocalDateTime.now().toString());
            Appointment updated = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable String id, Authentication auth) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            if (appointment.getPatientId().equals(auth.getName())) {
                appointment.setStatus("CANCELLED");
                appointment.setUpdatedAt(LocalDateTime.now().toString());
                appointmentRepository.save(appointment);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
