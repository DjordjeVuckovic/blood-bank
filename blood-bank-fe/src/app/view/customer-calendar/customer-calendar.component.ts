import {Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import {TokenStorageService} from "../../services/token-storage.service";
import {User} from "../../model/User";
import {CenterAdminService} from "../../services/center-admin.service";
import {Center} from "../../model/Center";
import {AppointmentService} from "../../services/appointment.service";
import {Appointment} from "../../model/Appointment";
import {map} from "rxjs";
import * as moment from "moment/moment";
import { HttpErrorResponse } from '@angular/common/http';
import { addDays, subDays } from 'date-fns';
import {ScheduleAppointmentService} from "../../services/schedule-appointment.service";
import {ExaminationService} from "../../services/examination.service";
import {Router} from "@angular/router";
import {ScheduleAppCustomer} from "../../model/ScheduleAppCustomer";
import {DialogSignComponent} from "../../components/dialog-sign/dialog-sign.component";
import {MatDialog} from "@angular/material/dialog";
import { DOCUMENT } from '@angular/common';
import {CancelAppointmentDialogComponent} from "../cancel-appointment-dialog/cancel-appointment-dialog.component";

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },

  blue: {
    primary: '#3c73b9',
    secondary: '#cbcbd226',
  },
  green: {
    primary: '#0b6623',
    secondary: '#e8fde7',
  },
};

@Component({
  selector: 'app-customer-calendar',
  templateUrl: './customer-calendar.component.html',
  //put calendar.scss for dark
  styleUrls: ['./customer-calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CustomerCalendarComponent implements OnInit {
  viewDate: Date;
  appointments: CalendarEvent<{}>[] = [];
  appointmentsResponse: Appointment[] = [];
  dayStartHour = 6;
  dayEndHour = 24;
  hourSegmentHeight = 110;
  daysInWeek = 7;
  view: CalendarView = CalendarView.Week;
  viewDateEnd: Date;
  canClickCancel:boolean = false
  canClickExamination:boolean = false
  private readonly user: User;
  monthView: boolean = false
  viewButton:string = "MONTH VIEW"
  selectedEvent: CalendarEvent<{ appointment: ScheduleAppCustomer }> = {
    title: null as any,
    start: null as any,
    color: { ...colors['blue'] },
    end: null as any,
    meta: null as any,
  };
  private readonly darkThemeClass = 'dark-theme';

  // @ts-ignore
  constructor(@Inject(DOCUMENT)private document,public dialog: MatDialog,private tokenStorageService: TokenStorageService,private adminCenterService:CenterAdminService
    ,private appService:AppointmentService,
              private readonly scheduleAppointmentService:ScheduleAppointmentService,
              private router:Router) {
    this.viewDate = new Date();
    this.viewDateEnd = addDays(this.viewDate, 6);
    this.user = this.tokenStorageService.getUser();
  }
  ngOnInit(): void {
    this.fetchData()
    //for dark
    // this.document.body.classList.add(this.darkThemeClass);
  }
  ngOnDestroy(): void {
    //for dark
    // this.document.body.classList.remove(this.darkThemeClass);
  }
  async handleCurrent(): Promise<void> {
    this.viewDate = new Date();
    this.viewDateEnd = addDays(this.viewDate, 6);
    await new Promise(resolve => setTimeout(resolve, 100));
    // this.paint()
  }

  async handlePrevious(): Promise<void> {
    this.viewDate = subDays(this.viewDate, 7);
    this.viewDateEnd = addDays(this.viewDate, 6);
    await new Promise(resolve => setTimeout(resolve, 100));
    // this.paint()
  }

  async handleNext(): Promise<void> {
    this.viewDate = addDays(this.viewDate, 7);
    this.viewDateEnd = addDays(this.viewDate, 6);
    await new Promise(resolve => setTimeout(resolve, 100));
    // this.paint()
  }
  onEventClick(event: any): void {
    this.selectedEvent.color = colors['blue'];
    this.selectedEvent = event.event;
    if(this.selectedEvent.meta?.appointment.status === 'PENDING'){
      this.canClickCancel = true;
    }
    console.log(event)
    this.selectedEvent.color = colors['green'];
  }
  createTitle(appointment: ScheduleAppCustomer): string {
    return (
      'Appointment:'+ '\n'+
      'Status: '+
      appointment.status +'\n'+
      'Date: '+
      appointment.date +
      '\n' +
      'Start time: '+
      appointment.startTime +
      '\n' +
      'Finish time: '+
      appointment.finishTime+
      '\n' +'Center:'+ '\n'+
      'Name: '+
      appointment.centerName
    );
  }
  private fetchData():void{
    this.getCenterAppointments()
  }
  private getCenterAppointments(){
    this.scheduleAppointmentService.getScheduledAppointmentForCustomer(this.user.id!)
      .pipe(
        map((results: ScheduleAppCustomer[]) => {
          return results.map((appointment: ScheduleAppCustomer) => {
            return {
              title: this.createTitle(appointment),
              start: this.setTime(appointment.date!,appointment.startTime!),
              end: this.setTime(appointment.date!,appointment.finishTime!),
              color: { ...colors['blue'] },
              meta: {
                appointment,
              },
            };
          });
        })
      )
      .subscribe(
        //@ts-ignore
        (response: CalendarEvent<{ appointment: Appointment }>[]) => {
          this.appointments = response;
          // this.paint()
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      );
  }
  private setTime(selectedDate:Date ,selectedTime:string){
    let selectedTimeDate = moment(selectedDate)
    let selectedHours:number = Number(selectedTime.slice(0,2))
    let selectedMinute:number = Number(selectedTime.slice(3,5))
    selectedTimeDate.set({hour:selectedHours,minute:selectedMinute})
    return selectedTimeDate.toDate()
  }
  monthShow() {
    this.monthView = !this.monthView;
    switch (this.viewButton) {
      case 'MONTH VIEW':
        this.viewButton = 'WEEK VIEW'
        break
      case 'WEEK VIEW':
        this.viewButton = 'MONTH VIEW'
        break
    }
  }
  private paint(){
    let elems = document.querySelectorAll('div.cal-header span')
    let elemsDays = document.querySelectorAll('div.cal-header b')
    console.log(elemsDays)
    let times = document.querySelectorAll('.cal-time')
    for (let i = 0; i < elems.length; i++) {
      const element = elems[i] as HTMLElement
      element.style.color = 'blue';
    }
    for (let i = 0; i < elemsDays.length; i++) {
      const element = elemsDays[i] as HTMLElement
      element.style.color = 'black';
    }
    for (let i = 0; i < times.length; i++) {
      const element = times[i] as HTMLElement
      element.style.color = '#3b4d79';
    }
  }
  openDialogCancel(): void {
    this.dialog.open(CancelAppointmentDialogComponent, {
      width: '500px',
      height:'200px',
      data: { appointmentId: this.selectedEvent.meta?.appointment.id! }
    });
  }
}
