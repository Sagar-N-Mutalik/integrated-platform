package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    List<Doctor> findByCity(String city);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByCityAndSpecialization(String city, String specialization);
    List<Doctor> findByHospitalId(String hospitalId);
    List<Doctor> findByIsAvailable(Boolean isAvailable);
}
