package ftn.uns.ac.rs.bloodbank.appointment.service;
import ftn.uns.ac.rs.bloodbank.appointment.dto.ScheduleAppointmentRequest;
import ftn.uns.ac.rs.bloodbank.appointment.model.Appointment;
import ftn.uns.ac.rs.bloodbank.appointment.model.AppointmentStatus;
import ftn.uns.ac.rs.bloodbank.appointment.model.ScheduleAppointment;
import ftn.uns.ac.rs.bloodbank.appointment.repository.ScheduleAppointmentRepository;
import ftn.uns.ac.rs.bloodbank.customer.service.CustomerFormService;
import ftn.uns.ac.rs.bloodbank.customer.service.CustomerService;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiBadRequestException;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiNotFoundException;
import lombok.AllArgsConstructor;
import javax.persistence.LockModeType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ScheduleAppointmentService {
    private final ScheduleAppointmentRepository scheduleAppointmentRepository;
    private final QRGeneratorService qrGeneratorService;
    private final AppointmentService appointmentService;
    private final CustomerFormService customerFormService;
    private final CustomerService customerService;
    private static final String QR_FILE_PATH = "./src/main/resources/QR/qr-code.png";
    @Transactional()
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public void createScheduleAppointment(ScheduleAppointmentRequest request)
    {
        var appointment = appointmentService.findByID(request.getAppointment_id());
        validateAppointment(appointment);
        var customer = customerService.getById(request.getCustomer_id());
        if(!checkIfDonatingIsPossible(customer.getId()))
            throw new ApiBadRequestException("You are have already donated blood in the last six months!");
       customerFormService.checkIfQuestionnaireIsFilledNow(customer.getId());
        var scheduleAppointment = ScheduleAppointment
                .builder()
                .appointment(appointment)
                .customer(customer)
                .status(AppointmentStatus.PENDING)
                .build();
        if (!checkIfCustomerAlreadyHasThatAppointment(scheduleAppointment))
            throw new ApiBadRequestException("You already have an appointment in selected center in the same time!");
        appointmentService.UpdateAppointmentDelete(appointment.getId());
        scheduleAppointmentRepository.save(scheduleAppointment);
        generateQRCodeAndSendEmail(scheduleAppointment);
    }

    private boolean checkIfCustomerAlreadyHasThatAppointment(ScheduleAppointment request) {
    var scheduledAppointments = scheduleAppointmentRepository.findScheduleAppointmentsCustomerId(request.getCustomer().getId());
    var filteredList = scheduledAppointments.stream().filter( x -> (
            x.getAppointment().getDate().isEqual(request.getAppointment().getDate()) &&
                    x.getAppointment().getStartTime().equals(request.getAppointment().getStartTime())
                    && x.getAppointment().getCenter().getId() == request.getAppointment().getCenter().getId())).toList();
    return filteredList.isEmpty();
    }

    private boolean checkIfDonatingIsPossible(UUID id) {
        var appointments = scheduleAppointmentRepository.findScheduleAppointmentsCustomerId(id);
        var currentDate = LocalDateTime.now();
        var currentDateMinus6Months = currentDate.minusMonths(6);
        if(appointments.isEmpty())
            return true;
       var lastAppointments =  appointments.stream()
                .filter(x -> x.getStatus() == AppointmentStatus.ACCEPTED
                        && (x.getAppointment().getDate()
                                            .isAfter(currentDateMinus6Months)
                        && x.getAppointment().getDate()
                        .isBefore(currentDate))).toList();
        return lastAppointments.isEmpty();
    }

    private static void validateAppointment(Appointment appointment) {
        if(appointment.isValidDate()){
            throw new ApiBadRequestException("Date is invalid");
        }
        if(appointment.isValidDateTime())
        {
            throw new ApiBadRequestException("Time is invalid");
        }if(appointment.isDeleted())
            throw new ApiBadRequestException("Appointment has already been scheduled");
    }

    private void generateQRCodeAndSendEmail(ScheduleAppointment scheduleAppointment) {
        try {
            qrGeneratorService.generateQRCodeImage(scheduleAppointment, 200, 200, QR_FILE_PATH);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    public ScheduleAppointment getScheduledAppointment(UUID id){
        var app = scheduleAppointmentRepository.findById(id)
                .orElseThrow(()-> new ApiNotFoundException("Appointment not found"));
        return app;
    }
    @Cacheable("schedule-appointments-for-center")
    public List<ScheduleAppointment> findScheduleAppointmentsCenterId(UUID centerId){
        return scheduleAppointmentRepository.findScheduleAppointmentsCenterId(centerId);
    }
    public List<ScheduleAppointment> findScheduleAppointmentsCustomerId(UUID customerId){
        return scheduleAppointmentRepository.findScheduleAppointmentsCustomerId(customerId);
    }

    public List<ScheduleAppointment> getAll(){
        return scheduleAppointmentRepository.findAll();
    }

    public void cancelScheduledAppointment(UUID id) {
        var scheduledAppointment = scheduleAppointmentRepository.findById(id)
                .orElseThrow(()->new ApiNotFoundException("Scheduled appointment doesn't exists!"));
        if(scheduledAppointment.getStatus() != AppointmentStatus.PENDING)
            throw new ApiBadRequestException("You can only cancel pending appointments!");
        var today = Calendar.getInstance();
        var now = LocalDateTime.now();
        var tomorrow = now.plusDays(1);
        var date = scheduledAppointment.getAppointment().getDate();
        if(!date.isAfter(tomorrow))
            throw new ApiBadRequestException("You can't reschedule an appointment if it's within 24h!");
        scheduleAppointmentRepository.deleteById(id);
        appointmentService.UpdateAppointmentDelete(scheduledAppointment.getAppointment().getId());
    }

    public ScheduleAppointment findScheduleAppointmentsByAppointmentId(UUID appointmentId){
        return scheduleAppointmentRepository.findScheduleAppointmentsByAppointmentId(appointmentId);
    }

    public ScheduleAppointment getById(UUID id) {
        return scheduleAppointmentRepository.findScheduleAppointmentById(id);
    }
    public List<ScheduleAppointment> findPassedScheduleAppointmentsByCustomerId(UUID customerId){
        var scheduleAppointments = scheduleAppointmentRepository.findScheduleAppointmentsCustomerId(customerId);
        return scheduleAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.ACCEPTED)
                .toList();
    }
}
