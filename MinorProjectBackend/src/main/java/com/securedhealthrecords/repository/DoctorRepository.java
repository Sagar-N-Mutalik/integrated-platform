package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    // --- METHODS FOR SEARCH CONTROLLER ---

    // Find by district, case-insensitive
    List<Doctor> findByDistrictIgnoreCase(String district);

    // Find by specialization (partial match, case-insensitive)
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    // Find by both (case-insensitive)
    List<Doctor> findByDistrictIgnoreCaseAndSpecializationContainingIgnoreCase(String district, String specialization);

    // Find by full name (partial match, case-insensitive)
    List<Doctor> findByFullNameContainingIgnoreCase(String fullName);

    // --- METHODS FOR OLD CONTROLLERS (Compatibility) ---

    List<Doctor> findByHospitalId(String hospitalId);
    List<Doctor> findByIsAvailable(Boolean isAvailable);

    // Compatibility: findByCity searches the 'district' field
    @Query("{'district' : ?0}")
    List<Doctor> findByCity(String city);

    // Compatibility: findByCityAndSpecialization searches 'district' and 'specialization'
    @Query("{ 'district' : ?0, 'specialization' : ?1 }")
    List<Doctor> findByCityAndSpecialization(String city, String specialization);

    // Compatibility: findBySpecialization (exact match, case-sensitive)
    List<Doctor> findBySpecialization(String specialization);
}