package ftn.uns.ac.rs.bloodbank.email;

import com.sendgrid.*;
import ftn.uns.ac.rs.bloodbank.customer.model.Customer;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@AllArgsConstructor
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private SendGrid sendGrid;

    public String sendEmail(Customer customerRequest, String token) throws IOException{
        String link = "http://localhost:8080/api/v1/registration/confirm?token=";
        Email from = new Email("ivanalazarevic01@gmail.com");
        String subject = "the subject";
        Email to = new Email(customerRequest.getEmail());
        Content content = new Content("text/plain", link+token);
        Mail mail = new Mail(from,subject,to,content);

        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sendGrid.api(request);
        logger.info(response.getBody());
        return response.getBody();
    }
    public String sendEmailQRAppointment(String base64) throws IOException{
        Email from = new Email("ivanalazarevic01@gmail.com");
        String subject = "the subject";
        Email to = new Email("ivanalazarevic01@gmail.com");
        Content content = new Content("text/plain", "Please scan the attached QR code to confirm your appointment.");
        Mail mail = new Mail(from,subject,to,content);
        Attachments attachments = new Attachments();
        attachments.setContent(base64);
        attachments.setType("image/png");
        attachments.setFilename("qr-code.png");
        attachments.setDisposition("attachment");
        attachments.setContentId("QR Code");
        mail.addAttachments(attachments);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sendGrid.api(request);
        logger.info(response.getBody());
        return response.getBody();
    }
}
