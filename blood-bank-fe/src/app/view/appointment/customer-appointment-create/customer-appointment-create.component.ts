import { Component, OnInit } from '@angular/core';
import {Center} from "../../../model/Center";
import {CenterService} from "../../../services/center.service";
import * as moment from "moment/moment";
import {AppointmentService} from "../../../services/appointment.service";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../../services/token-storage.service";
import {UserToken} from "../../../model/UserToken";
import {User} from "../../../model/User";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-customer-appointment-create',
  templateUrl: './customer-appointment-create.component.html',
  styleUrls: ['./customer-appointment-create.component.css']
})
export class CustomerAppointmentCreateComponent implements OnInit {

  centers : Center[]= []
  centersFiltered : Center[]= []
  sortedByGrade = false;
  selectedDate: Date | undefined
  selectedTime:any
  selectedTimeDate:any
  selectedAppointmentId: string | undefined = ""
  public visable = false;
  private userId= "";
  constructor(private centerService:CenterService, private appointmentService:AppointmentService,
              private router:Router,private tkStorage:TokenStorageService, private toast: ToastrService) {
    this.userId = this.tkStorage.getUser().id
  }

  ngOnInit(): void {
  }

  public getAllCenters(){
    console.log(this.selectedDate)
    console.log(this.selectedTime)
    this.setTime()
    
    if(this.selectedDate! < new Date()){
      this.toast.error("Select upcoming date.","Error")
    }
    else{
      this.centerService.getCentersWithAppointment(this.selectedTimeDate).subscribe(response => {
          this.centers = response;
          this.centersFiltered = response;
          console.log(response)
          this.visable = true;
        },
        error => {
          this.centersFiltered = []
          this.toast.error(error.error.message,"Error")
        })
    }

  }
  private setTime(){
    this.selectedTimeDate = moment(this.selectedDate)
    let selectedHours:number = Number(this.selectedTime.slice(0,2))
    let selectedMinute:number = Number(this.selectedTime.slice(3,5))
    this.selectedTimeDate.set({hour:selectedHours,minute:selectedMinute})
    console.log(this.selectedTimeDate)

  }

  schedule(selectedCenter: Center) {
      this.appointmentService.getWantedAppoontmentinCenter(this.selectedTimeDate,selectedCenter.id).subscribe(
        res => {
          this.selectedAppointmentId = res.id
          console.log(this.selectedAppointmentId)

          this.router.navigate(['/questionnaire'],{state:{data:this.selectedAppointmentId}})
        }
      )
  }

  sortByGrade() {
    if(!this.sortedByGrade){
      this.sortedByGrade = true
      this.centersFiltered.sort((a, b) => (a.avgGrade! > b.avgGrade! ? -1 : 1));
    }
    else{
      this.sortedByGrade = false
      this.centersFiltered.sort((a, b) => (a.name?.toLowerCase()! > b.name?.toLowerCase()! ? 1 : -1));

    }
  }
}
