package ftn.uns.ac.rs.bloodbank.center.dto;

import ftn.uns.ac.rs.bloodbank.sharedModel.Address;
import ftn.uns.ac.rs.bloodbank.sharedModel.GenderType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationUserDtoResponse {
    @NonNull
    private UUID id;

    @NonNull
    private String username;

    @NonNull
    private String name;

    @NonNull
    private String surname;

    @NonNull
    private String password;

    @NonNull
    private String phone;

    @NonNull
    private String jmbg;

    @NonNull
    private String email;


    @NonNull
    private GenderType gender;

    @NonNull
    private Address address;

    @NonNull
    private Boolean enabled;

    @NonNull
    private boolean deleted;
}
