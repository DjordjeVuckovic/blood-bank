import {MedicalStaffResponse} from "./Responses/MedicalStaffResponse";
export class Appointment {
  id?: string;
  date?: Date;
  startTime?: string;
  finishTime?: string;
  medicalStaffs?:MedicalStaffResponse[];
  // constructor(id: string, date: Date, startTime: string, finishTime: string,medicalStaff:MedicalStaffResponse[]) {
  //   this.id = id;
  //   this.date = date;
  //   this.startTime = startTime;
  //   this.finishTime = finishTime;
  //   this.medicalStaff = medicalStaff;
  // }
}
