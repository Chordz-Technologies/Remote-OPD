import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
  username: string | null = '';
  patientForm!: FormGroup;
  diseases: any[] = [];
  medicines: any[] = [];
  villages: any[] = [];
  camps: any[] = [];

  constructor(private fb: FormBuilder, private patientService: ServiceService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      patientName: ['', Validators.required],
      date: ['', Validators.required],
      villageName: ['', Validators.required],
      camp_name: ['',],
      category: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      ageGroup: ['', Validators.required],
      week: ['', Validators.required],
      mobileNo: ['', Validators.required],
      signSymptoms: ['',],
      physicalExamination: ['',],
      investigation: ['',],
      diagnosis: ['', Validators.required],
      prescribedMedicine1: ['',],
      prescribedMedicine2: ['',],
      dosage: ['',],
      treatmentRemark: ['',],
    });

    this.username = localStorage.getItem('username');

    this.patientService.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    this.patientService.getAllDiseases().subscribe((response: any) => {
      if (response.status === 'success') {
        this.diseases = response.all_diseases;
      }
    });

    this.patientService.getAllMedicines().subscribe((response: any) => {
      if (response.status === 'success') {
        this.medicines = response.all_mediciness;
      }
    });

    this.patientService.getAllCamps().subscribe((response: any) => {
      if (response.status === 'success') {
        this.camps = response.all_Camps;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonData = JSON.parse(e.target.result);
        this.patientForm.patchValue(jsonData);
      };
      reader.readAsText(file);
    }
  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);

    if (!isNaN(selectedDate.getTime())) {
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }); // Get day name (e.g., Monday)
      const month = selectedDate.toLocaleString('en-US', { month: 'long' }); // Get month name (e.g., January)
      const year = selectedDate.getFullYear();

      // Update the day and month form controls
      this.patientForm.patchValue({
        day: dayOfWeek, // Monday, Tuesday, etc.
        month: month, // January, February, etc.
        year: year // 2024, 2025, etc.
      });
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      this.patientService.addopdform(patientData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Patient Data Submitted Successfully!', 'Success');
            this.patientForm.reset();
          } else {
            this.toastr.error(response.msg, 'Error');
          }
          this.patientForm.reset();
          this.router.navigate(['/all_patient_info']);

        },
        (error) => {
          // Handle error response
          this.toastr.error(error?.error?.msg || 'Something went wrong',
            'Error');
          console.error('Error submitting patient data:', error);
        }
      );
    } else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
}
