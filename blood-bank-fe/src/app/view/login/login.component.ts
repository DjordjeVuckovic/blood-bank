import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CustomerRequest} from "../../model/Requests/CustomerRequest";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AddressRequest} from "../../model/Requests/AddressRequest";
import {ProfessionRequest} from "../../model/Requests/ProfessionRequest";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {LoginRequest} from "../../model/Requests/LoginRequest";
import {ToastrService} from "ngx-toastr";
import {CustomValidators} from "../../validators/CustomValidators";
import {Router} from "@angular/router";
import {ApplicationUser} from "../../model/ApplicationUser";
import {ApplicationUserService} from "../../services/applicationUser.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  step = 0;
  male ="MALE";
  female ="FEMALE";
  student = "STUDENT";
  pupil = "PUPIL";
  notEmployed = "NOT_EMPLOYED";
  employed = "NOT_EMPLOYED"

  @Output() onLogin: EventEmitter<ApplicationUser> = new EventEmitter<ApplicationUser>();

  submitted: boolean = false;
  formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined,Validators.required),
    username:new FormControl<string | undefined>(undefined,Validators.required),
    surname:new FormControl<string | undefined>(undefined,Validators.required),
    password:new FormControl<string | undefined>(undefined,Validators.required),
    confirmPassword : new FormControl<string | undefined>(undefined,[Validators.required]),
    phone:new FormControl<string | undefined>(undefined,Validators.required),
    jmbg:new FormControl<string | undefined>(undefined,Validators.required),
    email:new FormControl<string | undefined>(undefined,[
                                              Validators.required,
                                              Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    gender: new FormControl<string | undefined>(undefined, Validators.required),
    role:new FormControl<string | undefined>("ROLE_CUSTOMER"),
    address: new FormGroup({
      city: new FormControl<string | undefined>(undefined,Validators.required),
      street: new FormControl<string | undefined>(undefined,Validators.required),
      country: new FormControl<string | undefined>(undefined,Validators.required),
      streetNumber:new FormControl<string | undefined>(undefined,Validators.required)
    }),
    profession: new FormGroup({
      professionStatus: new FormControl<string | undefined>(undefined,Validators.required),
      professionDescription: new FormControl<string | undefined>(undefined,Validators.required),
    })
  },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]);

  rightActive:boolean = false
  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  loginForm = new FormGroup({
  username: new FormControl<string | undefined>(undefined),
  password: new FormControl<string | undefined>(undefined)
})

  constructor(private router: Router,private client: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder,private toast:ToastrService,private userService: ApplicationUserService) {}
  ngOnInit(): void {
      if (this.tokenStorage.getToken()){
        this.isLoggedIn = true;
      }

  }
  activatePanel():void {
    this.rightActive = ! this.rightActive
  }
  get passwordMatchError() {
    return (
      this.formGroup.getError('mismatch') &&
      this.formGroup.get('confirmPassword')?.touched
    );
  }
  onSignIn() {
    const user = new LoginRequest({
      username: this.loginForm.controls.username.value!,
      password: this.loginForm.controls.password.value!
    })
    this.client.login(user).subscribe({
      next: response => {
        this.tokenStorage.saveToken(response.jwt);
        this.tokenStorage.saveUser(response.jwt);
        this.isLoggedIn = true;
        this.reloadPage();
        if(this.tokenStorage.getUser().firstLogIn){
          this.router.navigate(['first-login']).then();
          return
        }
        this.determinateRole(response)
      },
      error: err => {
        this.toast.error(err.error.message,"Error")
      }
    })
  }
  determinateRole(response: any){
    if(this.tokenStorage.getUser().role === 'ROLE_CENTER_ADMIN'){
      this.router.navigate(['admin-center-profile']).then();
    }
    else{
      this.router.navigate(['facilities']).then();
    }
    this.onLogin.emit(response)
  }
  reloadPage(){
    window.location.reload();
  }
  onSignUp(){
      this.submitted = true;
      const customer = this.createCustomer();
      this.client.register(customer).subscribe({
        next: _ => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.toast.success("You have successfully registered, please verify your account!",'Success');
        },
        error: err => {
          this.toast.error(err.error.message,"Error")
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
      gender: this.formGroup.controls.gender.value!,
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
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
