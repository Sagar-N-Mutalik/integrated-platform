package com.securedhealthrecords.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDTO {

    private String hospitalName;
    private String district;
    private String location;
    private String type;
    private List<String> specialties;
    private String phone;
    private String altPhone;
    private String contact;
}
