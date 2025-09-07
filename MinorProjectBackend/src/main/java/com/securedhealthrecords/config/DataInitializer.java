package com.securedhealthrecords.config;

import com.securedhealthrecords.model.Doctor;
import com.securedhealthrecords.model.HealthTip;
import com.securedhealthrecords.model.Hospital;
import com.securedhealthrecords.repository.DoctorRepository;
import com.securedhealthrecords.repository.HealthTipRepository;
import com.securedhealthrecords.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DoctorRepository doctorRepository;
    private final HealthTipRepository healthTipRepository;
    private final HospitalRepository hospitalRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeHospitals();
        initializeDoctors();
        initializeHealthTips();
    }

    private void initializeHospitals() {
        if (hospitalRepository.count() == 0) {
            List<Hospital> hospitals = Arrays.asList(
                createHospital("Apollo Hospital", "Mumbai", "Comprehensive healthcare services", "apollo-mumbai@hospital.com", "+91-22-12345678"),
                createHospital("AIIMS Delhi", "Delhi", "Premier medical institute", "contact@aiims.edu", "+91-11-26588500"),
                createHospital("Manipal Hospital", "Bangalore", "Multi-specialty hospital", "info@manipalhospitals.com", "+91-80-25502121"),
                createHospital("Fortis Hospital", "Chennai", "Advanced medical care", "info@fortishealthcare.com", "+91-44-66765000"),
                createHospital("Max Healthcare", "Kolkata", "Quality healthcare services", "info@maxhealthcare.com", "+91-33-66206620")
            );
            hospitalRepository.saveAll(hospitals);
        }
    }

    private void initializeDoctors() {
        if (doctorRepository.count() == 0) {
            List<Hospital> hospitals = hospitalRepository.findAll();
            
            List<Doctor> doctors = Arrays.asList(
                createDoctor("Dr. Sarah Johnson", "sarah.johnson@hospital.com", "+91-9876543210", 
                    "Cardiologist", "MD, DM Cardiology", "10+ years", "Mumbai", 
                    hospitals.get(0).getId(), "Apollo Hospital", 4.8, 156, "₹800",
                    "Experienced cardiologist specializing in interventional cardiology and heart disease prevention.",
                    Arrays.asList("Monday", "Tuesday", "Wednesday", "Friday")),
                
                createDoctor("Dr. Raj Patel", "raj.patel@aiims.edu", "+91-9876543211",
                    "Neurologist", "MD, DM Neurology", "8+ years", "Delhi",
                    hospitals.get(1).getId(), "AIIMS Delhi", 4.7, 89, "₹1000",
                    "Neurologist with expertise in stroke management and neurodegenerative diseases.",
                    Arrays.asList("Monday", "Wednesday", "Thursday", "Saturday")),
                
                createDoctor("Dr. Priya Sharma", "priya.sharma@manipal.com", "+91-9876543212",
                    "Pediatrician", "MD Pediatrics", "12+ years", "Bangalore",
                    hospitals.get(2).getId(), "Manipal Hospital", 4.9, 203, "₹600",
                    "Pediatrician dedicated to child health and development with special interest in neonatology.",
                    Arrays.asList("Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")),
                
                createDoctor("Dr. Amit Kumar", "amit.kumar@fortis.com", "+91-9876543213",
                    "Orthopedic", "MS Orthopedics", "15+ years", "Chennai",
                    hospitals.get(3).getId(), "Fortis Hospital", 4.6, 134, "₹900",
                    "Orthopedic surgeon specializing in joint replacement and sports medicine.",
                    Arrays.asList("Monday", "Tuesday", "Thursday", "Friday")),
                
                createDoctor("Dr. Meera Singh", "meera.singh@maxhealthcare.com", "+91-9876543214",
                    "Dermatologist", "MD Dermatology", "7+ years", "Kolkata",
                    hospitals.get(4).getId(), "Max Healthcare", 4.5, 78, "₹700",
                    "Dermatologist with expertise in cosmetic dermatology and skin cancer treatment.",
                    Arrays.asList("Monday", "Wednesday", "Friday", "Saturday"))
            );
            
            doctorRepository.saveAll(doctors);
        }
    }

    private void initializeHealthTips() {
        if (healthTipRepository.count() == 0) {
            List<HealthTip> tips = Arrays.asList(
                createHealthTip("Stay Hydrated for Better Health", 
                    "Drink at least 8 glasses of water daily to maintain optimal health and energy levels. Proper hydration helps in digestion, circulation, and temperature regulation.",
                    "NUTRITION", "Dr. Health Expert"),
                
                createHealthTip("Daily Movement is Essential",
                    "Incorporate 30 minutes of physical activity into your daily routine for better cardiovascular health. This can include walking, swimming, or any activity you enjoy.",
                    "EXERCISE", "Fitness Specialist"),
                
                createHealthTip("Practice Mindful Moments",
                    "Take 5-10 minutes daily for meditation or deep breathing to reduce stress and improve focus. Mental health is just as important as physical health.",
                    "MENTAL_HEALTH", "Mental Health Counselor"),
                
                createHealthTip("Eat a Balanced Diet",
                    "Include a variety of fruits, vegetables, whole grains, and lean proteins in your diet. A balanced diet provides essential nutrients for optimal body function.",
                    "NUTRITION", "Nutritionist"),
                
                createHealthTip("Get Quality Sleep",
                    "Aim for 7-9 hours of quality sleep each night. Good sleep is crucial for physical recovery, mental clarity, and overall well-being.",
                    "GENERAL", "Sleep Specialist"),
                
                createHealthTip("Regular Health Checkups",
                    "Schedule regular health checkups with your doctor to catch potential health issues early. Prevention is always better than cure.",
                    "GENERAL", "General Practitioner")
            );
            
            healthTipRepository.saveAll(tips);
        }
    }

    private Hospital createHospital(String name, String city, String description, String email, String phone) {
        Hospital hospital = new Hospital();
        hospital.setName(name);
        hospital.setCity(city);
        hospital.setDescription(description);
        hospital.setEmail(email);
        hospital.setPhone(phone);
        hospital.setIsActive(true);
        hospital.setCreatedAt(LocalDateTime.now().toString());
        hospital.setUpdatedAt(LocalDateTime.now().toString());
        return hospital;
    }

    private Doctor createDoctor(String fullName, String email, String phone, String specialization,
                               String qualification, String experience, String city, String hospitalId,
                               String hospitalName, Double rating, Integer totalReviews, String consultationFee,
                               String bio, List<String> availableDays) {
        Doctor doctor = new Doctor();
        doctor.setFullName(fullName);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialization(specialization);
        doctor.setQualification(qualification);
        doctor.setExperience(experience);
        doctor.setCity(city);
        doctor.setHospitalId(hospitalId);
        doctor.setHospitalName(hospitalName);
        doctor.setRating(rating);
        doctor.setTotalReviews(totalReviews);
        doctor.setConsultationFee(consultationFee);
        doctor.setBio(bio);
        doctor.setAvailableDays(availableDays);
        doctor.setIsAvailable(true);
        doctor.setCreatedAt(LocalDateTime.now().toString());
        doctor.setUpdatedAt(LocalDateTime.now().toString());
        return doctor;
    }

    private HealthTip createHealthTip(String title, String content, String category, String author) {
        HealthTip tip = new HealthTip();
        tip.setTitle(title);
        tip.setContent(content);
        tip.setCategory(category);
        tip.setAuthor(author);
        tip.setIsActive(true);
        tip.setCreatedAt(LocalDateTime.now().toString());
        tip.setUpdatedAt(LocalDateTime.now().toString());
        return tip;
    }
}
