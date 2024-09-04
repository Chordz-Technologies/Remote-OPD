import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { Patient_model } from 'models';

@Component({
  selector: 'app-edit-patient-info',
  templateUrl: './edit-patient-info.component.html',
  styleUrls: ['./edit-patient-info.component.scss']
})
export class EditPatientInfoComponent implements OnInit {
  patientForm!: FormGroup;
  public patientId!: number;
  diseases: any[] = [];
  medicines: any[] = [];
  villages: any[] = [];
  camps: any[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService, private activatedRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      srNo: [''],
      patientName: [''],
      date: [''],
      villageName: [''],
      camp_name:[''],
      category: [''],
      gender: [''],
      age: [''],
      day: [''],
      month: [''],
      ageGroup: [''],
      week: [''],
      mobileNo: [''],
      signSymptoms: [''],
      physicalExamination: [''],
      investigation: [''],
      diagnosis: [''],
      prescribedMedicine1: [''],
      prescribedMedicine2: [''],
      dosage: [''],
      treatmentRemark: [''],
    });

    this.service.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    this.service.getAllDiseases().subscribe((response: any) => {
      if (response.status === 'success') {
        this.diseases = response.all_diseases;
      }
    });

    this.service.getAllMedicines().subscribe((response: any) => {
      if (response.status === 'success') {
        this.medicines = response.all_mediciness;
      }
    });

    this.service.getAllCamps().subscribe((response: any) => {
      if (response.status === 'success') {
        this.camps = response.all_Camps;
      }
    });

    this.activatedRoute.params.subscribe(val => {
      this.patientId = val['id'];
      this.service.getPatientDataById(this.patientId)
        .subscribe({
          next: (res) => {
            this.fillFormToUpdate(res.patient);
          },
          error: (err) => {
            console.log(err);
          }
        })
    })
  }

  fillFormToUpdate(patient: Patient_model) {
    this.patientForm.setValue({
      srNo: patient.srNo,
      patientName: patient.patientName,
      date: patient.date,
      villageName: patient.villageName,
      camp_name:patient.camp_name,
      category: patient.category,
      gender: patient.gender,
      age: patient.age,
      day: patient.day,
      month: patient.month,
      ageGroup: patient.ageGroup,
      week: patient.week,
      mobileNo: patient.mobileNo,
      signSymptoms: patient.signSymptoms,
      physicalExamination: patient.physicalExamination,
      investigation: patient.investigation,
      diagnosis: patient.diagnosis,
      prescribedMedicine1: patient.prescribedMedicine1,
      prescribedMedicine2: patient.prescribedMedicine2,
      dosage: patient.dosage,
      treatmentRemark: patient.treatmentRemark,
    })
  }

  update() {
    this.service.updatePatient(this.patientForm.value, this.patientId)
      .subscribe(res => {
        this.toastr.success('Patient Data Updated Successfully!', 'Success');
        this.router.navigate(['/all_patient_info']);
        this.patientForm.reset();
      });
  }
}