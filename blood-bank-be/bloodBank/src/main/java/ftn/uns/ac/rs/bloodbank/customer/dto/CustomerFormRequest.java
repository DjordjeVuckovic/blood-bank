package ftn.uns.ac.rs.bloodbank.customer.dto;

import ftn.uns.ac.rs.bloodbank.applicationUser.model.ApplicationUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerFormRequest {
    private Boolean isAge;
    private Boolean isWeight;
    private Boolean hadTransfusion;
    private Boolean hadCancer;
    private Boolean isSick;
    private Boolean isPregnant;
    private Boolean onPeriod;
    private Boolean isSexual;
    private Boolean isAllergic;
    private Boolean useMedication;
    private Boolean isUnderTherapy;
    private Boolean isBloodPressureNormal;
    private Boolean isDentis;
    private Boolean isPiercingTattoo;
    private UUID customerId;
    private Date submissionDate;
}
