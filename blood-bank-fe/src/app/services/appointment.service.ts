import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Appointment} from "../model/Appointment";
import {AppointmentRequest} from "../model/Requests/AppointmentRequest";
import {Moment} from "moment/moment";
import {AppointmentIdResponse} from "../model/Responses/AppointmentIdResponse";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiHost = 'http://localhost:8080/api/v1/appointments'
  headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http:HttpClient) { }

  getAppointmentsForCenter(centerId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiHost + `/center/${centerId}`, {headers: this.headers});
  }
  getFutureAppointmentForCenter(centerId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiHost + `/future/${centerId}`, {headers: this.headers});
  }
  getWantedAppoontmentinCenter(selectedTime:Moment,centerId:any): Observable<Appointment>{
    return this.http.post<Appointment>(this.apiHost + `/appointment-of-center/${centerId}`,selectedTime,{headers: this.headers} );
  }
  createAppointment(appointment: AppointmentRequest){
    return this.http.post(this.apiHost,appointment,{headers: this.headers})
  }

  readAppointmentFromQR(formData:any){
    return this.http.post<AppointmentIdResponse>(this.apiHost+'/uploadAppointmentQR', formData)
  }

}
