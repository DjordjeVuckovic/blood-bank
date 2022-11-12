import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import { IonicModule } from "@ionic/angular";
import { AppRoutingModule } from "./app-routing.module";
import {HttpClientModule} from '@angular/common/http'
import {FormsModule} from "@angular/forms";
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { BodyComponent } from './components/body/body.component';
import { AccountComponent } from './view/account/account.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {CenterViewModule} from "./view/centers/center-view.module";
import { LoginComponent } from './view/login/login.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AllUsersComponent } from './view/all-users/all-users.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {CommonComponentsModule} from "./components/common-components.module";
import {MatSelectModule} from "@angular/material/select";
import { ToastrModule } from 'ngx-toastr';
import {AppointmentModule} from "./view/appointment/appointment.module";
import {NgToastModule} from "ng-angular-popup";
import {QuestionnaireModule} from "./view/questionnaire/questionnaire.module";
import { AllDonorsComponent } from './view/customer/all-donors/all-donors.component';
import {MatDividerModule} from "@angular/material/divider";
import { DonorCardComponent } from './view/customer/donor-card/donor-card.component';
import { CenterDonorsComponent } from './view/customer/center-donors/center-donors.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigationBarComponent,
        BodyComponent,
        AccountComponent,
        LoginComponent,
        AllUsersComponent,
        AllDonorsComponent,
        DonorCardComponent,
        CenterDonorsComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        CenterViewModule,
        MatButtonToggleModule,
        CommonComponentsModule,
        MatDialogModule,
        MatSelectModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(),
        AppointmentModule,
        MatDialogModule,
        NgToastModule,
        MatDividerModule,
        QuestionnaireModule
    ],
    providers: [authInterceptorProviders],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
