import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';;
import { AppComponent } from './app.component';
import { PatientInfoComponent } from './Components/patient-info/patient-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './Components/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './Components/home/home.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AddusersbyAdminComponent } from './Components/addusersby-admin/addusersby-admin.component';
import { AllusersComponent } from './Components/allusers/allusers.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AllPatientsComponent } from './Components/all-patients/all-patients.component';
import { EditPatientInfoComponent } from './Components/edit-patient-info/edit-patient-info.component';
import { AllReportsComponent } from './Components/all-reports/all-reports.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientInfoComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    AddusersbyAdminComponent,
    AllusersComponent,
    AllPatientsComponent,
    EditPatientInfoComponent,
    AllReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    MatMenuModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
