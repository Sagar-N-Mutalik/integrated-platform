package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    List<Doctor> findByDistrictIgnoreCase(String district);

    List<Doctor> findByFullNameContainingIgnoreCase(String fullName);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    List<Doctor> findByDistrictIgnoreCaseAndSpecializationContainingIgnoreCase(String district, String specialization);
}
