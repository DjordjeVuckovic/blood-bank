package ftn.uns.ac.rs.bloodbank.customer.service;

import ftn.uns.ac.rs.bloodbank.customer.dto.CustomerFormRequest;
import ftn.uns.ac.rs.bloodbank.customer.model.CustomerForm;
import ftn.uns.ac.rs.bloodbank.customer.model.PatientValidDonor;
import ftn.uns.ac.rs.bloodbank.customer.repository.CustomerFormRepository;
import ftn.uns.ac.rs.bloodbank.customer.repository.CustomerRepository;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiBadRequestException;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiNotFoundException;
import ftn.uns.ac.rs.bloodbank.mapper.MapperService;
import ftn.uns.ac.rs.bloodbank.sharedModel.GenderType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.Transient;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomerFormService {
    private final CustomerFormRepository customerFromRepository;
    private final CustomerRepository customerRepository;
    private final MapperService mapperService;
    @Transient
    public CustomerForm createCustomerForm(CustomerFormRequest customerForm){
        var customer = customerRepository.findById(customerForm.getCustomerId()).orElseThrow(() ->
                new ApiBadRequestException("Customer doesnt exists"));
        var form = CustomerForm
                .builder()
                .isAge(customerForm.getIsAge())
                .isAllergic(customerForm.getIsAllergic())
                .isSick(customerForm.getIsSick())
                .isSexual(customerForm.getIsSexual())
                .isWeight(customerForm.getIsWeight())
                .isDentis(customerForm.getIsDentis())
                .isPiercingTattoo(customerForm.getIsPiercingTattoo())
                .hadCancer(customerForm.getHadCancer())
                .hadTransfusion(customerForm.getHadTransfusion())
                .useMedication(customerForm.getUseMedication())
                .isUnderTherapy(customerForm.getIsUnderTherapy())
                .onPeriod(customerForm.getOnPeriod())
                .isPregnant(customerForm.getIsPregnant())
                .isBloodPressureNormal(customerForm.getIsBloodPressureNormal())
                .submissionDate(customerForm.getSubmissionDate())
                .customer(customer)
                        .build();
        form.setCustomer(customer);
        if(customer.getGender() == GenderType.MALE){
            form.setIsPregnant(false);
            form.setOnPeriod(false);
        }
        customerFromRepository.save(form);
        return form;
    }
    public List<CustomerForm> sortByDate(List<CustomerForm> customerForms) {
        return customerForms.stream().sorted((o1, o2) -> o2.getSubmissionDate().compareTo(o1.getSubmissionDate()))
                .collect(Collectors.toList());
    }
    public CustomerForm checkQuestionnaireExistence(UUID patientId){
        var patientForms = customerFromRepository.findByCustomerId(patientId);
        var patientForm = sortByDate(patientForms).stream().findFirst().orElseThrow(()-> new ApiNotFoundException("Questionnaire for this customer not found"));
        return patientForm;
    }
    public CustomerForm checkIfQuestionnaireIsFilledNow(UUID patientId){
        var patientForms = customerFromRepository.findByCustomerId(patientId);
        var patientForm = sortByDate(patientForms).stream().findFirst().orElseThrow(()-> new ApiNotFoundException("Questionnaire for this customer not found"));
        var today = Calendar.getInstance();
        var calendarForm = Calendar.getInstance();
        calendarForm.setTime(patientForm.getSubmissionDate());
        if(!(today.get(Calendar.YEAR) == calendarForm.get(Calendar.YEAR)
                && today.get(Calendar.MONTH) == calendarForm.get(Calendar.MONTH)
                && today.get(Calendar.DAY_OF_MONTH) ==  calendarForm.get(Calendar.DAY_OF_MONTH)))
            throw new ApiNotFoundException("You must fill out a questionnaire!");
        return patientForm;
    }
    public ArrayList<PatientValidDonor> checkIfPatientSuitableBloodDonor(UUID patientId){

       var patient = customerRepository.findById(patientId).orElseThrow(()-> new ApiNotFoundException("Patient doesnt exist"));
       var patientForm = checkQuestionnaireExistence(patientId);
       var patientValidity = new ArrayList<PatientValidDonor>();
       if(patientForm.getHadCancer()){
           var patientValid = PatientValidDonor
                   .builder()
                   .reason("Patient had cancer.")
                   .isValidDonor(false)
                   .build();
           patientValidity.add(patientValid);
       }
       if(patientForm.getHadTransfusion()){
           var patientValid = PatientValidDonor
                   .builder()
                   .reason("Patient had a blood or blood product transfusion since 1st January 1980.")
                   .isValidDonor(false)
                   .build();
           patientValidity.add(patientValid);
       }
       if(!patientForm.getIsAge()){
           var patientValid = PatientValidDonor
                   .builder()
                   .reason("Patient is under or below 16 – 65 years old.")
                   .isValidDonor(false)
                   .build();
           patientValidity.add(patientValid);
       }
        if(patientForm.getIsWeight()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient weigh is less than 50kg (7 stone 12 pounds)")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getIsSexual()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient had sexual intercourse in the last six months without protection")
                    .isValidDonor(false)
                    .build();

            patientValidity.add(patientValid);
        }
        if(patientForm.getIsPregnant() && patient.getGender() == GenderType.FEMALE){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient is pregnant.")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getOnPeriod() && patient.getGender() == GenderType.FEMALE){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient is currently on menstrual period.")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getUseMedication()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient take any medication in last 7 days")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getIsAllergic()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient have allergies on skin")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getIsSick()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient has been sick in the last 7 days")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getIsUnderTherapy()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient has therapy in the last 7 days")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(!patientForm.getIsBloodPressureNormal()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient blood pressure is not in normal range.")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getIsDentis()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient has been to the dentist in the last 7 days")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientForm.getIsPiercingTattoo()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient had a piercing or tattoo done in the past 6 months")
                    .isValidDonor(false)
                    .build();
            patientValidity.add(patientValid);
        }
        if(patientValidity.isEmpty()){
            var patientValid = PatientValidDonor
                    .builder()
                    .reason("Patient is suitable for donating blood")
                    .isValidDonor(true)
                    .build();
            patientValidity.add(patientValid);
        }
        return patientValidity;
    }
}
