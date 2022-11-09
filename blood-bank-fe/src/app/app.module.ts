import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import { IonicModule } from "@ionic/angular";
import { AppRoutingModule } from "./app-routing.module";
import {HttpClientModule,HttpHeaders} from '@angular/common/http'
import {FormsModule} from "@angular/forms";
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { BodyComponent } from './components/body/body.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import { AccountComponent } from './view/accounts/account/account.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {CenterViewModule} from "./view/centers/center-view.module";
import {GoogleMapApiService} from "./services/googleMapApi.service";


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    BodyComponent,
    AccountComponent
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
    CenterViewModule
  ],
  providers: [GoogleMapApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
