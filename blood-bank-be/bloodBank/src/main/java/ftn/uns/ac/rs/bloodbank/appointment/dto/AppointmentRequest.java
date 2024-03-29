package ftn.uns.ac.rs.bloodbank.appointment.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentRequest implements Serializable {
    @NonNull
    private  LocalDateTime date;
    @NonNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;
    @NonNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private  LocalTime finishTime;
    private  List<UUID> medicalStaffs;
    private  UUID centerId;
}
