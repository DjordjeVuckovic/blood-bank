package ftn.uns.ac.rs.bloodbank.examination.dto;

import ftn.uns.ac.rs.bloodbank.blood.dto.BloodDonationDto;
import ftn.uns.ac.rs.bloodbank.blood.model.BloodDonation;
import ftn.uns.ac.rs.bloodbank.center.dto.CenterEquipmentDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExaminationDto implements Serializable {
    private UUID appointmentId;
    private Boolean isAppeared;
    private Boolean isSuitableBloodDonor;
    private BloodDonationDto bloodDonation;
    private List<CenterEquipmentDto> centerEquipments;
}
