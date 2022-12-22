package ftn.uns.ac.rs.bloodbank.appointment.service;

import ftn.uns.ac.rs.bloodbank.appointment.dto.AppointmentRequest;
import ftn.uns.ac.rs.bloodbank.appointment.model.Appointment;
import ftn.uns.ac.rs.bloodbank.appointment.repository.AppointmentRepository;
import ftn.uns.ac.rs.bloodbank.center.repository.CenterRepository;
import ftn.uns.ac.rs.bloodbank.centerAdministrator.CenterAdminRepository;
import ftn.uns.ac.rs.bloodbank.centerAdministrator.CenterAdministrator;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiBadRequestException;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final CenterAdminRepository centerAdminRepository;
    private final CenterRepository centerRepository;
    @Transactional
    public void createAppointment(AppointmentRequest appointmentRequest){
        var appointment = Appointment
                .builder()
                .startTime(appointmentRequest.getStartTime())
                .finishTime(appointmentRequest.getFinishTime())
                .date(appointmentRequest.getDate())
                .deleted(false)
                .build();
        validateDate(appointment);
        Set<CenterAdministrator> staff = getCenterAdministrators(appointmentRequest);
        appointment.setMedicalStaffs(staff);
        var center =centerRepository.findById(appointmentRequest.getCenterId()).orElseThrow(() -> new ApiBadRequestException("Center doesnt exist!"));
        center.addAppointment(appointment);
        appointmentRepository.save(appointment);
    }
    private Set<CenterAdministrator> getCenterAdministrators(AppointmentRequest appointmentRequest) {
        return appointmentRequest.getMedicalStaffs().stream()
                        .map(uuid -> {
                            var admin =centerAdminRepository.findById(uuid).orElseThrow(() -> new ApiBadRequestException("Wrong staff id provided!"));
                            System.out.println(admin.getUsername());
                            return admin;
                        })
                        .collect(Collectors.toSet());
    }

    public List<Appointment> getAllAppointmentsForCenter(UUID centerId){
        return appointmentRepository.getAllAppointmentsForCenter(centerId);
    }


    public List<CenterAdministrator> getMedicalStaffsForAppointment(UUID appointmentId){
        return appointmentRepository.getMedicalStaffsForAppointment(appointmentId);
    }
    private void validateDate(Appointment appointment){
        if(!appointment.isValidDate()){
            throw new ApiBadRequestException("Please select upcoming date!");
        }
        if(!appointment.isValidDateTime()){
            throw new ApiBadRequestException("Wrong start time and end time range!");
        }
    }
    public Appointment findByID(UUID appointmentId){
        var appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiNotFoundException("Appointment not found"));
        return appointment;
    }
}
