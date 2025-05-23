import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  villageName: any[] = []; // Subvillages will be stored here
  clients: any[] = [];
  filteredVillages: any[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService, private activatedRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      srNo: [''],
      client_name: ['', Validators.required],
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
      prescribedMedicine3: ['',],
      prescribedMedicine4: ['',],
      diagnosis2: ['',],
      dosage: ['',],
      treatmentRemark: ['',]
    });

    // Fetch all required data
    this.loadInitialData();

    // Fetch patient data to edit
    this.activatedRoute.params.subscribe(val => {
      this.patientId = val['id'];
      this.service.getPatientDataById(this.patientId)
        .subscribe({
          next: (res) => {
            this.fillFormToUpdate(res.patient); // Populate form with patient data
          },
          error: (err) => {
            console.log(err);
          }
        });
    });
  }

  loadInitialData(): void {
    // Fetch all villages
    this.service.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    // Fetch all diseases
    this.service.getAllDiseases().subscribe((response: any) => {
      if (response.status === 'success') {
        this.diseases = response.all_diseases;
      }
    });

    // Fetch all medicines
    this.service.getAllMedicines().subscribe((response: any) => {
      if (response.status === 'success') {
        this.medicines = response.all_mediciness;
      }
    });

    // Fetch client names
    this.service.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
      }
    });
  }

  onClientChange(event: any): void {
    const selectedClientId = +event.target.value;

    // Filter villages based on selected client ID
    this.filteredVillages = this.villages.filter(village => village.client === selectedClientId);

    // Clear previously selected values
    this.patientForm.patchValue({ village: '', villageName: '' });
    this.villageName = [];
  }

  // Handle village selection
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

  // Handle date change and auto-fill day, month, year, week
  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);

    if (!isNaN(selectedDate.getTime())) {
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
      const month = selectedDate.toLocaleString('en-US', { month: 'long' });
      const year = selectedDate.getFullYear();
      const week = this.getWeekNumber(selectedDate);

      this.patientForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
        week: week
      });
    }
  }

  // Function to calculate the ISO week number
  getWeekNumber(date: Date): number {
    const targetDate = new Date(date.getTime());

    // Adjust to the nearest Thursday (ISO weeks are anchored to Thursdays)
    const dayOfWeek = (targetDate.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    targetDate.setDate(targetDate.getDate() - dayOfWeek + 3);

    // Get the first Thursday of the year
    const firstThursday = new Date(targetDate.getFullYear(), 0, 4);
    const firstWeekStart = new Date(firstThursday.getTime());
    firstWeekStart.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7));

    // Calculate week number
    const diff = targetDate.getTime() - firstWeekStart.getTime();
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  // Handle age group auto-fill based on age
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

      this.patientForm.patchValue({
        ageGroup: ageGroup
      });
    }
  }

  // Fill form with patient data when editing
  fillFormToUpdate(patient: Patient_model) {
    // First set basic form values (excluding client_name, village, villageName)
    this.patientForm.patchValue({
      srNo: patient.srNo,
      patientName: patient.patientName,
      date: patient.date,
      category: patient.category,
      gender: patient.gender,
      age: patient.age,
      day: patient.day,
      month: patient.month,
      year: patient.year,
      ageGroup: patient.ageGroup,
      week: patient.week,
      mobileNo: patient.mobileNo,
      signSymptoms: patient.signSymptoms,
      physicalExamination: patient.physicalExamination,
      investigation: patient.investigation,
      diagnosis: patient.diagnosis,
      diagnosis2: patient.diagnosis2,
      prescribedMedicine1: patient.prescribedMedicine1,
      prescribedMedicine2: patient.prescribedMedicine2,
      prescribedMedicine3: patient.prescribedMedicine3,
      prescribedMedicine4: patient.prescribedMedicine4,
      dosage: patient.dosage,
      treatmentRemark: patient.treatmentRemark,
    });

    // STEP 1: Set client and trigger village loading
    const selectedClient = this.clients.find(c => c.client_name === patient.client_name);
    if (selectedClient) {
      this.patientForm.patchValue({ client_name: selectedClient.client_id });
      this.onClientChange({ target: { value: selectedClient.client_id } });

      // Wait a tick to allow `filteredVillages` to populate
      setTimeout(() => {
        // STEP 2: Set main village and trigger sub-village loading
        const selectedVillage = this.filteredVillages.find(v => v.name === patient.village);
        if (selectedVillage) {
          this.patientForm.patchValue({ village: selectedVillage.id });
          this.onMainVillageChange({ target: { value: selectedVillage.id } });

          // STEP 3: Wait a tick to allow `villageName` to populate
          setTimeout(() => {
            this.patientForm.patchValue({ villageName: patient.villageName });
          }, 200); // adjust timeout if needed
        }
      }, 200);
    }
  }

  // Update patient information
  update() {
    if (!this.patientForm.valid) {
      this.toastr.error('Please fill all required fields.', 'Error');
      return;
    }

    const patientData = { ...this.patientForm.value }; // Use spread to avoid mutating original form

    // Convert village ID to name
    const selectedVillage = this.villages.find(village => village.id === +patientData.village);
    if (selectedVillage) {
      patientData.village = selectedVillage.name;
    }

    // Set sub-village name
    patientData.villageName = this.patientForm.get('villageName')?.value || '';

    // Convert client_id to client_name
    const selectedClient = this.clients.find(client => client.client_id === +patientData.client_name);
    if (selectedClient) {
      patientData.client_name = selectedClient.client_name;
    }

    this.service.updatePatient(patientData, this.patientId).subscribe({
      next: res => {
        this.toastr.success('Patient Data Updated Successfully!', 'Success');
        this.patientForm.reset();
        this.patientForm.patchValue({ client_name: selectedClient?.client_id }); // Set client ID again if needed
        this.router.navigate(['/all_patient_info']);
      },
      error: err => {
        this.toastr.error('Update failed. Please try again.', 'Error');
        console.error(err);
      }
    });
  }

  delete() {
    if (this.patientId) {
      this.service.deletePatient(this.patientId).subscribe(
        () => {
          this.toastr.success('Patient deleted successfully!');
          this.patientForm.reset();
          this.router.navigate(['/all_patient_info']);
        },
        () => {
          this.toastr.error('Failed to delete patient.');
        }
      );
    }
  }
}
