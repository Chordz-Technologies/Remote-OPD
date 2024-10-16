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

  // Function to calculate ISO week number
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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
    this.patientForm.setValue({
      srNo: patient.srNo,
      client_name: patient.client_name,
      patientName: patient.patientName,
      date: patient.date,
      village: patient.village,
      villageName: patient.villageName,
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

    if (patient.village) {
      const selectedVillage = this.villages.find(village => village.name === patient.village);
      if (selectedVillage) {
        this.patientForm.patchValue({ village: selectedVillage.id });
        this.onMainVillageChange({ target: { value: selectedVillage.id } });

        this.patientForm.patchValue({
          villageName: patient.villageName // directly set as a string
        });
      }
    }
  }

  // Update patient information
  update() {
    const patientData = this.patientForm.value;
    const selectedVillage = this.villages.find(village => village.id === +patientData.village);
    if (selectedVillage) {
      patientData.village = selectedVillage.name; // Set the village name instead of ID
    }
    const selectedSubVillage = this.patientForm.get('villageName')?.value;
    patientData.villageName = selectedSubVillage; // This should be a string

    if (this.patientForm.valid) {
      this.service.updatePatient(patientData, this.patientId)
        .subscribe(res => {
          this.toastr.success('Patient Data Updated Successfully!', 'Success');
          const clientName = this.patientForm.get('client_name')?.value;
          this.patientForm.reset();
          this.patientForm.patchValue({ client_name: clientName });
          this.router.navigate(['/all_patient_info']);
        });
    }
    else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
}
