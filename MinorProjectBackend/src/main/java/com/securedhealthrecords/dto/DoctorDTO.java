package com.securedhealthrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private String fullName;
    private String specialization;
    private String district;
    private String hospitalName;
    private Boolean isAvailable;
    private Double rating;
    private Integer totalReviews;
}
