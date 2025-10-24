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
import org.springframework.util.StringUtils; // Import StringUtils for checking empty strings

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

// @Component  // DISABLED: Using JsonDataLoader instead
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DoctorRepository doctorRepository;
    private final HealthTipRepository healthTipRepository;
    private final HospitalRepository hospitalRepository;

    @Override
    public void run(String... args) throws Exception {
        // --- Correct Logic: Only seed if the database collection is EMPTY ---
        if (hospitalRepository.count() == 0) {
            System.out.println(">>> No hospitals found in DB. Seeding sample hospital data...");
            initializeHospitals(); // Call helper only if empty
        } else {
             System.out.println(">>> Hospitals already exist in DB. Skipping hospital seed.");
        }

        // Check doctors AFTER hospitals, as doctors might need linked hospital IDs
        if (doctorRepository.count() == 0) {
             System.out.println(">>> No doctors found in DB. Seeding sample doctor data...");
            // Ensure hospitals exist before trying to seed doctors that link to them
             if (hospitalRepository.count() > 0) {
                 initializeDoctors(); // Call helper only if doctors are empty AND hospitals exist
             } else {
                 System.err.println(">>> ERROR: Cannot seed sample doctors because no hospitals exist in the database!");
             }
        } else {
             System.out.println(">>> Doctors already exist in DB. Skipping doctor seed.");
        }

        if (healthTipRepository.count() == 0) {
             System.out.println(">>> No health tips found in DB. Seeding sample health tips...");
            initializeHealthTips(); // Call helper only if empty
        } else {
            System.out.println(">>> Health tips already exist in DB. Skipping health tip seed.");
        }
    }

    // Helper method to create sample hospitals IF NEEDED
    private void initializeHospitals() {
        // This code only runs if hospitalRepository.count() was 0
        List<Hospital> hospitals = Arrays.asList(
            // Sample data uses districts from your list and includes 'c' field
            createHospital("Manipal Hospital", "Bangalore", "Old Airport Road", "Private (Teaching)", "Cardiology, Oncology, Neurology", "18001025555", "105710", "info@manipal.com"),
             createHospital("Apollo BGS Hospital", "Mysuru", "Kuvempunagar", "Private", "Cardiac Sciences, Oncology", "+918069049759", "1066", "info@apollo.com"),
             createHospital("Kasturba Hospital", "Udupi", "Manipal", "Private (Teaching)", "Multi-Super Specialty, Cardiology", "0820-2922761", "0820-2922222", "medical.superintendent@manipal.edu")
             // Add more samples using your 7 districts if desired (Raichur, Davangere, Hubli, Shivamogga)
        );
        hospitalRepository.saveAll(hospitals);
         System.out.println(">>> Sample hospitals seeded successfully.");
    }

    // Helper method to create sample doctors IF NEEDED
    private void initializeDoctors() {
        // This code only runs if doctorRepository.count() was 0
        List<Hospital> hospitals = hospitalRepository.findAll(); // Get hospitals (sample or real)
        // Need hospitals to link doctors - critical check already done in run() method
        // but double-checking here is safe.
        if (hospitals.isEmpty()) {
             System.err.println(">>> ERROR: Cannot seed sample doctors because no hospitals exist in the database (Checked again in initializeDoctors)!");
             return; // Stop if no hospitals are available to link to
        }
         // Safer way to get hospital IDs for linking sample doctors
         String hospital1Id = !hospitals.isEmpty() ? hospitals.get(0).getId() : "tempHospitalId1";
         String hospital1Name = !hospitals.isEmpty() ? hospitals.get(0).getName() : "Sample Hospital 1";
         // Use modulo to safely wrap around if fewer hospitals than needed
         int numHospitals = hospitals.size();
         String hospital2Id = hospitals.get(1 % numHospitals).getId();
         String hospital2Name = hospitals.get(1 % numHospitals).getName();
         String hospital3Id = hospitals.get(2 % numHospitals).getId();
         String hospital3Name = hospitals.get(2 % numHospitals).getName();


        List<Doctor> doctors = Arrays.asList(
            // Sample data uses districts from your list
            createDoctor("Dr. Priya Sharma", "Pediatrician", "Bangalore", hospital1Name, hospital1Id),
             createDoctor("Dr. Anish Behl", "Endocrinology & Diabetes Care", "Mysuru", hospital2Name, hospital2Id),
             createDoctor("Dr. Anil K Bhat", "Anaesthesiology", "Udupi", hospital3Name, hospital3Id)
            // Add more samples using your 7 districts if desired
        );
        doctorRepository.saveAll(doctors);
         System.out.println(">>> Sample doctors seeded successfully.");
    }

    // --- Helper methods updated with NULL CHECKS ---

    private Hospital createHospital(String name, String district, String address, String c, String specialties, String phone1, String phone2, String email) {
        Hospital hospital = new Hospital();
        // Add null/empty checks for safety
        if (StringUtils.hasText(name)) hospital.setName(name);
        if (StringUtils.hasText(district)) hospital.setDistrict(district);
        if (StringUtils.hasText(address)) hospital.setAddress(address);
        if (StringUtils.hasText(c)) hospital.setC(c); // Check 'c'
        if (StringUtils.hasText(specialties)) hospital.setSpecialties(specialties);
        if (StringUtils.hasText(phone1)) hospital.setPhone1(phone1);
        if (StringUtils.hasText(phone2)) hospital.setPhone2(phone2);
        if (StringUtils.hasText(email)) hospital.setEmail(email);

        hospital.setIsActive(true); // Default to active
        hospital.setCreatedAt(LocalDateTime.now().toString());
        hospital.setUpdatedAt(LocalDateTime.now().toString());
        return hospital;
    }

    private Doctor createDoctor(String fullName, String specialization, String district, String hospitalName, String hospitalId) {
        Doctor doctor = new Doctor();
        // Add null/empty checks
        if (StringUtils.hasText(fullName)) doctor.setFullName(fullName);
        if (StringUtils.hasText(specialization)) doctor.setSpecialization(specialization);
        if (StringUtils.hasText(district)) doctor.setDistrict(district);
        if (StringUtils.hasText(hospitalName)) doctor.setHospitalName(hospitalName);
        if (StringUtils.hasText(hospitalId)) doctor.setHospitalId(hospitalId); // Link to hospital

        doctor.setIsAvailable(true); // Default to available
        doctor.setCreatedAt(LocalDateTime.now().toString());
        doctor.setUpdatedAt(LocalDateTime.now().toString());
        // Add defaults for optional fields
        doctor.setRating(4.5);
        doctor.setTotalReviews(20);
        doctor.setConsultationFee("₹600");
        return doctor;
    }

     private void initializeHealthTips() {
        // This code only runs if healthTipRepository.count() was 0
        List<HealthTip> tips = Arrays.asList(
                createHealthTip("Stay Hydrated", "Drink 8 glasses of water daily...", "NUTRITION", "Dr. Health"),
                createHealthTip("Move Daily", "Incorporate 30 mins of activity...", "EXERCISE", "Fitness Coach"),
                 createHealthTip("Mindful Moments", "Practice 5-10 mins of meditation...", "MENTAL_HEALTH", "Wellness Expert")
        );
        healthTipRepository.saveAll(tips);
         System.out.println(">>> Sample health tips seeded successfully.");
    }

    // Helper for HealthTip (Add null checks if necessary)
    private HealthTip createHealthTip(String title, String content, String category, String author) {
        HealthTip tip = new HealthTip();
         if (StringUtils.hasText(title)) tip.setTitle(title);
         if (StringUtils.hasText(content)) tip.setContent(content);
         if (StringUtils.hasText(category)) tip.setCategory(category);
         if (StringUtils.hasText(author)) tip.setAuthor(author);
        tip.setIsActive(true);
        tip.setCreatedAt(LocalDateTime.now().toString());
        tip.setUpdatedAt(LocalDateTime.now().toString());
        return tip;
    }
}



