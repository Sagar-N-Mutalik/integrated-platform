package com.securedhealthrecords.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hospitals")
public class Hospital {

    @Id
    private String id;

    @Indexed
    @Field("hospitalName")
    @JsonProperty("hospitalName")
    private String hospitalName;

    @Indexed
    @Field("district")
    @JsonProperty("district")
    private String district;

    @Field("location")
    @JsonProperty("location")
    private String location;

    @Field("hospitalType")
    @JsonProperty("hospitalType")
    private String hospitalType; // replaces old field "C" or "type"

    @Field("specialties")
    @JsonProperty("specialties")
    private List<String> specialties; // already array-based

    @Field("phone")
    @JsonProperty("phone")
    private String phone;

    @Field("altPhone")
    @JsonProperty("altPhone")
    private String altPhone;

    @Field("contact")
    @JsonProperty("contact")
    private String contact;

    private String description;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;

    public Hospital(String hospitalName, String district, String location, String hospitalType, String phone) {
        this.hospitalName = hospitalName;
        this.district = district;
        this.location = location;
        this.hospitalType = hospitalType;
        this.phone = phone;
        this.isActive = true;
    }
}
