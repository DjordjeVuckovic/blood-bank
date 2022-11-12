import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {AllCentersComponent} from "./view/centers/all-centers/all-centers.component"
import {CenterProfileComponent} from "./view/centers/center-profile/center-profile.component";
import {LoginComponent} from "./view/login/login.component";
import {UpdateCenterComponent} from "./view/centers/update-center/update-center.component";
import {AccountComponent} from "./view/account/account.component";
import {CreateCenterComponent} from "./view/centers/create-center/create-center.component";
import {AllUsersComponent} from "./view/all-users/all-users.component";
import {CenterAdminProfileComponent} from "./view/centers/center-admin-profile/center-admin-profile.component";
import {CreateAppointmentComponent} from "./view/appointment/create-appointment/create-appointment.component";
import {QuestionnaireComponent} from "./view/questionnaire/questionnaire.component";
import {AllDonorsComponent} from "./view/customer/all-donors/all-donors.component";
import {CenterDonorsComponent} from "./view/customer/center-donors/center-donors.component";


const routes: Routes = [
  { path: 'facilities', component: AllCentersComponent },
  { path: 'account', component: AccountComponent },
  { path: 'center-profile', component: CenterProfileComponent},
  { path: 'update-center', component: UpdateCenterComponent},
  { path: 'create-center', component: CreateCenterComponent},
  { path: 'all-users', component: AllUsersComponent},
  { path:'',component:LoginComponent},
  { path:'admin-center-profile',component:CenterAdminProfileComponent},
  { path:'add-appointment',component:CreateAppointmentComponent},
  {path:'questionnaire', component: QuestionnaireComponent},
  { path:'all-donors',component:AllDonorsComponent},
  { path:'center-donors',component:CenterDonorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
