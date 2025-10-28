package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends MongoRepository<Hospital, String> {

    // ✅ Finder methods for search and linking
    Optional<Hospital> findByHospitalNameIgnoreCase(String hospitalName);
    Optional<Hospital> findByHospitalNameAndDistrict(String hospitalName, String district);

    List<Hospital> findByDistrictContainingIgnoreCase(String district);
    List<Hospital> findByHospitalNameContainingIgnoreCase(String hospitalName);
}
