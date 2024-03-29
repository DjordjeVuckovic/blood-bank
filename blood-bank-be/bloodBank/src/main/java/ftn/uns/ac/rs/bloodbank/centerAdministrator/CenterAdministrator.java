package ftn.uns.ac.rs.bloodbank.centerAdministrator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ftn.uns.ac.rs.bloodbank.applicationUser.model.ApplicationUser;
import ftn.uns.ac.rs.bloodbank.center.model.Center;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Setter
@Getter
@Entity(name = "CenterAdministrator")
@DiscriminatorValue("1")
public class CenterAdministrator extends ApplicationUser {
    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "center_id", referencedColumnName = "id")
    private Center center;
}
