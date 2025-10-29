package com.securedhealthrecords.service;

import com.securedhealthrecords.model.Appointment;
import com.securedhealthrecords.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    /**
     * Send appointment request to doctor
     */
    public void sendAppointmentRequest(Appointment appointment) {
        try {
            emailService.sendAppointmentRequestEmail(
                appointment.getDoctorEmail(),
                appointment.getDoctorName(),
                appointment.getPatientName(),
                appointment.getPatientEmail(),
                appointment.getPatientPhone(),
                appointment.getAppointmentDateTime(),
                appointment.getReason(),
                appointment.getId()
            );
            log.info("✅ Appointment request email sent to doctor: {}", appointment.getDoctorEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send appointment request email: {}", e.getMessage());
        }
    }

    /**
     * Send appointment confirmation to patient
     */
    public void sendAppointmentConfirmation(Appointment appointment) {
        try {
            emailService.sendAppointmentConfirmationEmail(
                appointment.getPatientEmail(),
                appointment.getPatientName(),
                appointment.getDoctorName(),
                appointment.getAppointmentDateTime(),
                appointment.getHospitalName()
            );
            log.info("✅ Appointment confirmation email sent to patient: {}", appointment.getPatientEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send appointment confirmation email: {}", e.getMessage());
        }
    }

    /**
     * Send appointment rejection notification to patient
     */
    public void sendAppointmentRejection(Appointment appointment) {
        try {
            emailService.sendAppointmentRejectionEmail(
                appointment.getPatientEmail(),
                appointment.getPatientName(),
                appointment.getDoctorName(),
                appointment.getAppointmentDateTime()
            );
            log.info("✅ Appointment rejection email sent to patient: {}", appointment.getPatientEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send appointment rejection email: {}", e.getMessage());
        }
    }

    /**
     * Scheduled task to send appointment reminders
     * Runs every hour to check for appointments in the next 24 hours
     */
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);
        
        // Find appointments that are tomorrow and haven't had reminders sent
        List<Appointment> upcomingAppointments = appointmentRepository
            .findByAppointmentDateTimeBetweenAndStatusAndReminderSent(
                now, tomorrow, "ACCEPTED", false
            );

        log.info("🔔 Checking for appointment reminders. Found {} appointments", upcomingAppointments.size());

        for (Appointment appointment : upcomingAppointments) {
            try {
                emailService.sendAppointmentReminderEmail(
                    appointment.getPatientEmail(),
                    appointment.getPatientName(),
                    appointment.getDoctorName(),
                    appointment.getAppointmentDateTime(),
                    appointment.getHospitalName()
                );
                
                // Mark reminder as sent
                appointment.setReminderSent(true);
                appointmentRepository.save(appointment);
                
                log.info("✅ Reminder sent for appointment: {}", appointment.getId());
            } catch (Exception e) {
                log.error("❌ Failed to send reminder for appointment {}: {}", appointment.getId(), e.getMessage());
            }
        }
    }

    /**
     * Get accepted appointments for a patient
     */
    public List<Appointment> getAcceptedAppointments(String patientId) {
        return appointmentRepository.findByPatientIdAndStatusIn(
            patientId, 
            List.of("ACCEPTED", "PENDING")
        );
    }
}
