package com.securedhealthrecords.controller;

import com.securedhealthrecords.model.Appointment;
import com.securedhealthrecords.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment, Authentication auth) {
        appointment.setPatientId(auth.getName());
        appointment.setStatus("SCHEDULED");
        appointment.setIsPaid(false);
        appointment.setCreatedAt(LocalDateTime.now().toString());
        appointment.setUpdatedAt(LocalDateTime.now().toString());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication auth) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(auth.getName());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        return appointment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
