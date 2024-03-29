package ftn.uns.ac.rs.bloodbank.center.model;

import ftn.uns.ac.rs.bloodbank.customer.model.Customer;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Entity(name = "CenterGrade")
@Table(name = "center_grade")
public class CenterGrade implements Serializable {
    @Id
    @GeneratedValue
    @Column(name = "id",nullable = false,updatable = false,columnDefinition = "uuid")
    private UUID id;
    @ManyToOne
    private Center center;
    @ManyToOne
    private Customer customer;
    private Integer grade;
}
