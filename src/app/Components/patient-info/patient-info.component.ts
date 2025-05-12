import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit, AfterViewInit {
  username: string | null = '';
  patientForm!: FormGroup;
  diseases: any[] = [];
  medicines: any[] = [];
  villages: any[] = [];
  villageName: string[] = [];
  camps: any[] = [];
  clients: any[] = [];
  displayedColumns: string[] = ['patientName', 'date', 'category', 'diagnosis'];
  searchPatientName: string = '';
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  changeDetectorRef: any;
  filteredVillages: any[] = [];

  constructor(private fb: FormBuilder, private patientService: ServiceService, private router: Router, private toastr: ToastrService) { }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
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

    this.patientService.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
      }
    });
  }

  // Function to fetch patient history by name
  fetchPatientHistory(patientName: string): void {
    this.patientService.getPatientHistory(patientName).subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          // Convert the single object data to an array of one object for MatTable compatibility
          const formattedData = [response.data];
          this.dataSource.data = formattedData;
          this.changeDetectorRef.detectChanges(); // Manually trigger change detection
        } else {
          this.toastr.error('No patient found with the given name', 'Error'); // Toastr error message
        }
      },
      error: (err) => {
        this.toastr.error('No patient found with the given name.', 'Error'); // Toastr error message
      }
    });
  }

  // Function triggered when the search button is clicked
  onSearch(): void {
    this.fetchPatientHistory(this.searchPatientName.trim());
  }

  onClientChange(event: any): void {
    const selectedClientId = +event.target.value;

    // Filter villages based on selected client ID
    this.filteredVillages = this.villages.filter(village => village.client === selectedClientId);

    // Clear previously selected values
    this.patientForm.patchValue({ village: '', villageName: '' });
    this.villageName = [];
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

    // Replace village ID with village name
    const selectedVillage = this.villages.find(village => village.id === +patientData.village);
    if (selectedVillage) {
      patientData.village = selectedVillage.name;
    }

    // Replace client ID with client name
    const selectedClient = this.clients.find(client => client.client_id === +patientData.client_name);
    if (selectedClient) {
      patientData.client_name = selectedClient.client_name;
    }

    if (this.patientForm.valid) {
      this.patientService.addopdform(patientData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Patient Data Submitted Successfully!', 'Success');
            const clientName = selectedClient?.client_name;
            this.patientForm.reset();
            this.patientForm.patchValue({ client_name: clientName });
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
    } else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
}

