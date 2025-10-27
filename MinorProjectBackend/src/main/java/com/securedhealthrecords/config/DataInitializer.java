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
        if (hospitalRepository.count() == 0) {
            System.out.println(">>> No hospitals found in DB. Seeding sample hospital data...");
            initializeHospitals();
        } else {
            System.out.println(">>> Hospitals already exist in DB. Skipping hospital seed.");
        }

        if (doctorRepository.count() == 0) {
            System.out.println(">>> No doctors found in DB. Seeding sample doctor data...");
            if (hospitalRepository.count() > 0) {
                initializeDoctors();
            } else {
                System.err.println(">>> ERROR: Cannot seed sample doctors because no hospitals exist in the database!");
            }
        } else {
            System.out.println(">>> Doctors already exist in DB. Skipping doctor seed.");
        }

        if (healthTipRepository.count() == 0) {
            System.out.println(">>> No health tips found in DB. Seeding sample health tips...");
            initializeHealthTips();
        } else {
            System.out.println(">>> Health tips already exist in DB. Skipping health tip seed.");
        }
    }

    private void initializeHospitals() {
        List<Hospital> hospitals = Arrays.asList(
            createHospital("Manipal Hospital", "Bengaluru", "Old Airport Road", "Private (Teaching)", "Cardiology, Oncology, Neurology", "18001025555", "105710", "info@manipal.com"),
            createHospital("Apollo BGS Hospital", "Mysuru", "Kuvempunagar", "Private", "Cardiac Sciences, Oncology", "+918069049759", "1066", "info@apollo.com"),
            createHospital("Kasturba Hospital", "Udupi", "Manipal", "Private (Teaching)", "Multi-Super Specialty, Cardiology", "0820-2922761", "0820-2922222", "medical.superintendent@manipal.edu")
        );
        hospitalRepository.saveAll(hospitals);
        System.out.println(">>> Sample hospitals seeded successfully.");
    }

    private void initializeDoctors() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        if (hospitals.isEmpty()) {
            System.err.println(">>> ERROR: Cannot seed sample doctors because no hospitals exist in the database (Checked again in initializeDoctors)!");
            return;
        }

        String hospital1Id = !hospitals.isEmpty() ? hospitals.get(0).getId() : "tempHospitalId1";
        String hospital1Name = !hospitals.isEmpty() ? hospitals.get(0).getHospitalName() : "Sample Hospital 1";
        int numHospitals = hospitals.size();
        String hospital2Id = hospitals.get(1 % numHospitals).getId();
        String hospital2Name = hospitals.get(1 % numHospitals).getHospitalName();
        String hospital3Id = hospitals.get(2 % numHospitals).getId();
        String hospital3Name = hospitals.get(2 % numHospitals).getHospitalName();

        List<Doctor> doctors = Arrays.asList(
            createDoctor("Dr. Priya Sharma", "Pediatrician", "Bengaluru", hospital1Name, hospital1Id),
            createDoctor("Dr. Anish Behl", "Endocrinology & Diabetes Care", "Mysuru", hospital2Name, hospital2Id),
            createDoctor("Dr. Anil K Bhat", "Anaesthesiology", "Udupi", hospital3Name, hospital3Id)
        );
        doctorRepository.saveAll(doctors);
        System.out.println(">>> Sample doctors seeded successfully.");
    }

    private Hospital createHospital(String name, String district, String address, String c, String specialties, String phone1, String phone2, String email) {
        Hospital hospital = new Hospital();
        if (StringUtils.hasText(name)) hospital.setHospitalName(name);
        if (StringUtils.hasText(district)) hospital.setDistrict(district);
        if (StringUtils.hasText(address)) hospital.setLocation(address);
        if (StringUtils.hasText(c)) hospital.setHospitalType(c);
        if (StringUtils.hasText(specialties)) {
            hospital.setSpecialties(Arrays.stream(specialties.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList());
        }
        if (StringUtils.hasText(phone1)) hospital.setPhone(phone1);
        if (StringUtils.hasText(phone2)) hospital.setAltPhone(phone2);
        if (StringUtils.hasText(email)) hospital.setContact(email);

        hospital.setIsActive(true);
        hospital.setCreatedAt(LocalDateTime.now().toString());
        hospital.setUpdatedAt(LocalDateTime.now().toString());
        return hospital;
    }

    private Doctor createDoctor(String fullName, String specialization, String district, String hospitalName, String hospitalId) {
        Doctor doctor = new Doctor();
        if (StringUtils.hasText(fullName)) doctor.setFullName(fullName);
        if (StringUtils.hasText(specialization)) doctor.setSpecialization(specialization);
        if (StringUtils.hasText(district)) doctor.setDistrict(district);
        if (StringUtils.hasText(hospitalName)) doctor.setHospitalName(hospitalName);
        if (StringUtils.hasText(hospitalId)) doctor.setHospitalId(hospitalId);

        doctor.setIsAvailable(true);
        doctor.setCreatedAt(LocalDateTime.now().toString());
        doctor.setUpdatedAt(LocalDateTime.now().toString());
        doctor.setRating(4.5);
        doctor.setTotalReviews(20);
        doctor.setConsultationFee("₹600");
        return doctor;
    }

    private void initializeHealthTips() {
        List<HealthTip> tips = Arrays.asList(
                createHealthTip("Stay Hydrated", "Drink 8 glasses of water daily...", "NUTRITION", "Dr. Health"),
                createHealthTip("Move Daily", "Incorporate 30 mins of activity...", "EXERCISE", "Fitness Coach"),
                createHealthTip("Mindful Moments", "Practice 5-10 mins of meditation...", "MENTAL_HEALTH", "Wellness Expert")
        );
        healthTipRepository.saveAll(tips);
        System.out.println(">>> Sample health tips seeded successfully.");
    }

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