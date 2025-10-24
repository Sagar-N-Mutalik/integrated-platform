package com.securedhealthrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDTO {
    // This object structures the hospital data sent to the frontend

    private String id;        // MongoDB document ID
    private String name;       // From JSON field "name" (originally "A")
    private String district;   // From JSON field "district"
    private String address;    // From JSON field "address" (originally "B")
    private String c;          // Added - From JSON field "C" (hospital type)
    private String specialties;// From JSON field "specialties" (originally "D", as String)
    private String phone1;     // From JSON field "phone1" (originally "E")
    private String phone2;     // From JSON field "phone2" (originally "F")
    private String email;      // From JSON field "email" (originally "G")
}


