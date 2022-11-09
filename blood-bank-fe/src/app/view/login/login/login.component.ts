import { Component, OnInit } from '@angular/core';
import {CustomerRequest} from "../../../model/CustomerRequest";
import {FormControl, FormGroup} from "@angular/forms";
import {AddressRequest} from "../../../model/AddressRequest";
import {ProfessionRequest} from "../../../model/ProfessionRequest";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined),
    username:new FormControl<string | undefined>(undefined),
    surname:new FormControl<string | undefined>(undefined),
    password:new FormControl<string | undefined>(undefined),
    phone:new FormControl<string | undefined>(undefined),
    jmbg:new FormControl<string | undefined>(undefined),
    email:new FormControl<string | undefined>(undefined),
    role:new FormControl<string | undefined>("ROLE_CUSTOMER"),
    address: new FormGroup({
       city: new FormControl<string | undefined>(undefined),
       street: new FormControl<string | undefined>(undefined),
       country: new FormControl<string | undefined>(undefined),
       streetNumber:new FormControl<string | undefined>(undefined)
}),
    profession: new FormGroup({
      professionStatus: new FormControl<string | undefined>(undefined),
      professionDescription: new FormControl<string | undefined>(undefined),
    })
  });
  rightActive:boolean = false
  userId:string = "";
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private client: AuthService) { }
  ngOnInit(): void {

  }
  activatePanel():void {
    this.rightActive = ! this.rightActive
  }

  public signIn() {

  }
  onSignUp(){
    const customer = this.createCustomer();
   console.log(customer)
    this.client.register(customer).subscribe({
      next: response => {
        console.log(response)
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      }
    })
  }

  private createCustomer(): CustomerRequest {
   return  new CustomerRequest({
      username: this.formGroup.controls.username.value!,
      name: this.formGroup.controls.name.value!,
      surname: this.formGroup.controls.surname.value!,
      email: this.formGroup.controls.email.value!,
      password: this.formGroup.controls.password.value!,
      phone: this.formGroup.controls.phone.value!,
      jmbg: this.formGroup.controls.jmbg.value!,
      address: new AddressRequest({
        street: this.formGroup.controls.address.controls.street.value!,
        country: this.formGroup.controls.address.controls.country.value!,
        streetNumber: this.formGroup.controls.address.controls.streetNumber.value!,
        city: this.formGroup.controls.address.controls.city.value!,
      }),
     role: this.formGroup.controls.role.value!,
      profession: new ProfessionRequest({
        professionDescription: this.formGroup.controls.profession.controls.professionDescription.value!,
        professionStatus: this.formGroup.controls.profession.controls.professionStatus.value!
      })
    })
  }
}