import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { PatientInfoComponent } from './Components/patient-info/patient-info.component';
import { HomeComponent } from './Components/home/home.component';
import { AddusersbyAdminComponent } from './Components/addusersby-admin/addusersby-admin.component';
import { AuthGuard } from './guard/auth.guard';
import { AllPatientsComponent } from './Components/all-patients/all-patients.component';
import { EditPatientInfoComponent } from './Components/edit-patient-info/edit-patient-info.component';
import { AllReportsComponent } from './Components/all-reports/all-reports.component';
import { CampsComponent } from './Components/camps/camps.component';
import { EditVillagesComponent } from './Components/edit-villages/edit-villages.component';
import { AllCampsComponent } from './Components/all-camps/all-camps.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'patient_info_form', component: PatientInfoComponent },
      { path: 'dashboard', component: AddusersbyAdminComponent },
      { path: 'all_patient_info', component: AllPatientsComponent },
      { path: 'edit_patient_info/:id', component: EditPatientInfoComponent },
      { path: 'add_villages', component: EditVillagesComponent },
      { path: 'edit_villages/:id', component: EditVillagesComponent },
      { path: 'all_reports', component: AllReportsComponent },
      { path: 'camps_forms', component: CampsComponent },
      { path: 'all_camps', component: AllCampsComponent },
      { path: 'all_reports', component: AllReportsComponent }
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
