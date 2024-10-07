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
  villageName: string[] = [];
  camps: any[] = [];
  clients: any[] = [];

  constructor(private fb: FormBuilder, private patientService: ServiceService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      client_name: ['',],
      patientName: ['', Validators.required],
      date: ['', Validators.required],
      village: ['', Validators.required],
      villageName: ['', Validators.required],
      category: ['',],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      ageGroup: ['', Validators.required],
      week: ['', Validators.required],
      mobileNo: ['',],
      signSymptoms: ['',],
      physicalExamination: ['',],
      investigation: ['',],
      diagnosis: ['', Validators.required],
      prescribedMedicine1: ['',],
      prescribedMedicine2: ['',],
      dosage: ['',],
      treatmentRemark: ['',]
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

    // Fetch client names
    this.patientService.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
      }
    });
  }

  onMainVillageChange(event: any): void {
    const selectedVillageId = event.target.value;
    const selectedVillage = this.villages.find(village => village.id === +selectedVillageId);

    if (selectedVillage) {
      this.villageName = selectedVillage.vnames;
      this.patientForm.patchValue({ villageName: '' }); // Reset sub-village when main village changes
    } else {
      this.villageName = []; // Clear sub-villages if no main village is selected
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonData = JSON.parse(e.target.result);

        // Map village name to corresponding id
        const selectedVillage = this.villages.find(v => v.name === jsonData.village);
        if (selectedVillage) {
          jsonData.village = selectedVillage.id; // Set the id of the village
          this.onMainVillageChange({ target: { value: selectedVillage.id } }); // Trigger village change to populate sub-villages

          // Set the sub-village if it exists
          if (selectedVillage.vnames.includes(jsonData.villageName)) {
            this.patientForm.patchValue({ villageName: jsonData.villageName });
          }
        }

        this.patientForm.patchValue(jsonData);
      };
      reader.readAsText(file);
    }
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const jsonData = JSON.parse(e.target.result);
  //       this.patientForm.patchValue(jsonData);
  //     };
  //     reader.readAsText(file);
  //   }
  // }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);

    if (!isNaN(selectedDate.getTime())) {
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }); // Get day name (e.g., Monday)
      const month = selectedDate.toLocaleString('en-US', { month: 'long' }); // Get month name (e.g., January)
      const year = selectedDate.getFullYear();
      const week = this.getWeekNumber(selectedDate); // Calculate week number

      // Update the day and month form controls
      this.patientForm.patchValue({
        day: dayOfWeek, // Monday, Tuesday, etc.
        month: month, // January, February, etc.
        year: year, // 2024, 2025, etc.
        week: week // Week number
      });
    }
  }

  // Function to calculate the ISO week number
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;

    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  onAgeChange(event: any): void {
    const age = parseInt(event.target.value, 10);

    if (!isNaN(age)) {
      let ageGroup = '';

      if (age >= 0 && age <= 18) {
        ageGroup = 'Child';
      } else if (age >= 19 && age <= 35) {
        ageGroup = 'Young';
      } else if (age >= 36 && age <= 65) {
        ageGroup = 'Adult';
      } else if (age >= 66) {
        ageGroup = 'Geriatric';
      }

      // Set the ageGroup value in the form control
      this.patientForm.patchValue({
        ageGroup: ageGroup
      });
    }
  }

  onSubmit() {
    const patientData = this.patientForm.value;
    const selectedVillage = this.villages.find(village => village.id === +patientData.village);
    if (selectedVillage) {
      patientData.village = selectedVillage.name; // Set the village name instead of ID
    }

    if (this.patientForm.valid) {
      this.patientService.addopdform(patientData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Patient Data Submitted Successfully!', 'Success');
            this.patientForm.reset();
            this.router.navigate(['/all_patient_info']);
          } else {
            this.toastr.error(response.msg, 'Error');
          }
        },
        (error) => {
          this.toastr.error(error?.error?.msg || 'Something went wrong', 'Error');
          console.error('Error submitting patient data:', error);
        }
      );
    }
    else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
}

