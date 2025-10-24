package com.securedhealthrecords.repository;

import com.securedhealthrecords.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends MongoRepository<Hospital, String> {

    // --- METHODS FOR SEARCH CONTROLLER ---

    // Search by name (case-insensitive) - Uses the 'name' field from Hospital.java
    List<Hospital> findByNameContainingIgnoreCase(String name);

    // Search by district (case-insensitive) - Uses the 'district' field from Hospital.java
    List<Hospital> findByDistrictIgnoreCase(String district);

    // Search by specialty string (case-insensitive) - Uses the 'specialties' field (String) from Hospital.java
    // Note: This matches if the search term is anywhere within the comma-separated string.
    List<Hospital> findBySpecialtiesContainingIgnoreCase(String specialty);

    // --- METHOD KEPT FOR OLD HospitalController / HospitalService COMPATIBILITY ---

    // This query correctly searches the 'name' and 'district' fields from the updated model.
    // It does not involve the 'c' field.
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'district': { $regex: ?1, $options: 'i' } } ] }")
    List<Hospital> findByNameOrCity(String name, String district); // Method name kept for compatibility, but param/logic uses district
}

