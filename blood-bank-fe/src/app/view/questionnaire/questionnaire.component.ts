import { Component, OnInit } from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {QuestionnaireRequest} from "../../model/Questionnaire";
import {TokenStorageService} from "../../services/token-storage.service";
import {ApplicationUserService} from "../../services/applicationUser.service";
import {QuestionnaireService} from "../../services/customer-form.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import { ApplicationUserImp} from "../../model/ApplicationUser";

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  stepper: MatStepper | undefined;
  applicationUser = new ApplicationUserImp();
  questionnaire  = new QuestionnaireRequest();
  female : boolean = false;
  questions : string[] =[
    '1. Are you 16 – 65 years old?',
    '2. Do you currently weigh less than 50kg (7 stone 12 pounds)?',
    '3. Have you had sexual intercourse in the last six months without protection?',
    '4. Are you pregnant?',
    '5. Are tou currently on your period?',
    '1.Have you had a blood or blood product transfusion since 1st January 1980?',
    '2.Have you ever had a cancer other than basal cell carcinoma or cervical carcinoma insitu (CIN)?',
    '3. Do you take any medication?',
    '4. Do tou have any allergies?',
    '5. Have you been sick in the last 7 days?'
  ]
    enableSubmit =  false;
  constructor(private router: Router,private toast: ToastrService,private tokenStorage : TokenStorageService,private customerClient : ApplicationUserService, private client: QuestionnaireService) { }

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
   this.questionnaire.customerId = user.id;
    this.getUserById(user.id);
  }

  private getUserById(id: string) {
    this.customerClient.getCustomerById(id).subscribe({
      next: response => {
        this.applicationUser = response;
        console.log(this.applicationUser.gender);
        this.checkGender();
      }
    })
  }

  private checkGender() {
    if (this.applicationUser.gender === "FEMALE") {
      this.female = true;
    }
  }

  next(stepper:MatStepper){
    this.stepper = stepper;
    this.stepper.next();
  }
  onAnswer1(answer: string){
    console.log(answer);
    this.questionnaire.isAge = this.stringToBoolean(answer);
  }
  onAnswer2(answer: string){
    this.questionnaire.isWeight = this.stringToBoolean(answer);
  }
  onAnswer3(answer: string){
    this.questionnaire.isSexual = this.stringToBoolean(answer);
  }
  onAnswer4(answer: string){
    this.questionnaire.isPregnant = this.stringToBoolean(answer);
  }
  onAnswer5(answer: string){
    this.questionnaire.onPeriod =this.stringToBoolean(answer);
    }
  onAnswer6(answer: string){
      this.questionnaire.hadTransfusion = this.stringToBoolean(answer);
    }
  onAnswer7(answer: string){
      this.questionnaire.hadCancer = this.stringToBoolean(answer);
    }
  onAnswer8(answer: string){
      this.questionnaire.useMedication = this.stringToBoolean(answer);
    }
  onAnswer9(answer: string){
      this.questionnaire.isAllergic = this.stringToBoolean(answer);
    }
  onAnswer10(answer: string){
    console.log(typeof(answer));
      this.questionnaire.isSick = this.stringToBoolean(answer);
    }
  onSubmitQuestionnaire(){
    this.checkAllFieldstoneSubmitting();
    if(this.enableSubmit){
      this.questionnaire.submissionDate = new Date();
      this.client.createQuestionnaire(this.questionnaire).subscribe({
        next: _ => {
          this.toast.success("You have successfully submitted your blood donor questionnaire!","Success");
          this.router.navigateByUrl("/facilities");
        }
      })
    }else {
      this.toast.error("All questions must be answered!","Error");
    }
  }

  private checkAllFieldstoneSubmitting() {
    if(this.applicationUser.gender === "MALE"){
      this.checkForMaleDonors();
    }else {
      this.checkForFemaleDonors();
    }
  }

  private checkForMaleDonors() {
    if (this.questionnaire.isSick !== undefined
      && this.questionnaire.isAllergic !== undefined
      && this.questionnaire.useMedication !== undefined
      && this.questionnaire.hadCancer !== undefined
      && this.questionnaire.hadTransfusion !== undefined
      && this.questionnaire.isSexual !== undefined
      && this.questionnaire.isAge !== undefined) {
      this.enableSubmit = true;
    }
  }

  private checkForFemaleDonors() {
    if (this.questionnaire.isSick !== undefined
      && this.questionnaire.isAllergic !== undefined
      && this.questionnaire.useMedication !== undefined
      && this.questionnaire.hadCancer !== undefined
      && this.questionnaire.hadTransfusion !== undefined
      && this.questionnaire.isSexual !== undefined
      && this.questionnaire.isPregnant !== undefined
      && this.questionnaire.onPeriod !== undefined
      && this.questionnaire.isAge !== undefined) {
      this.enableSubmit = true;
    }
  }

  stringToBoolean(answer : string){
    return answer === 'yes';
  }
}
