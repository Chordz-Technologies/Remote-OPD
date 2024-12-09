import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-ad-camp',
  templateUrl: './edit-ad-camp.component.html',
  styleUrls: ['./edit-ad-camp.component.scss']
})
export class EditAdCampComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  aarogyaCampForm!: FormGroup;
  selectedId: number | null = null;
  villages: any[] = [];
  subVillages: string[] = [];
  villageName: string[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService, private dialog: MatDialog,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Initialize the form
    this.aarogyaCampForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      age: ['', Validators.required],
      village: ['', Validators.required],
      villageName: ['', Validators.required],
      standard: ['',],
      contact: ['',],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      BMI: ['', Validators.required], // Auto-calculated BMI
      BMIReadings: ['', Validators.required], // Auto-populated BMI status
      HB: ['', [Validators.required, Validators.min(1)]], // HB field
      HBReadings: ['', Validators.required], // HB status field
    });

    // Watch for weight and height changes to calculate BMI
    this.aarogyaCampForm.get('weight')?.valueChanges.subscribe(() => {
      this.calculateBMI();
    });

    this.aarogyaCampForm.get('height')?.valueChanges.subscribe(() => {
      this.calculateBMI();
    });

    this.service.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    // Check if editing an existing disease
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedId = +id;
        this.loadDetails(this.selectedId);
      }
    });
  }

  onMainVillageChange(event: any): void {
    const selectedVillageId = event.target.value;
    const selectedVillage = this.villages.find(village => village.id === +selectedVillageId);

    if (selectedVillage) {
      this.villageName = selectedVillage.vnames;

      this.subVillages = selectedVillage.vnames;
    } else {
      this.subVillages = []; // Clear sub-villages if no main village is selected
    }
  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    if (!isNaN(selectedDate.getTime())) {
      const month = selectedDate.toLocaleString('en-US', { month: 'long' }); // Get month name (e.g., January)
      const year = selectedDate.getFullYear();
      this.aarogyaCampForm.patchValue({
        month: month,
        year: year,
      });
    }
  }

  calculateBMI(): void {
    const weight = this.aarogyaCampForm.get('weight')?.value;
    const height = this.aarogyaCampForm.get('height')?.value;

    if (weight && height) {
      // Convert height from cm to meters for BMI calculation
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      // Round the BMI to an integer (no decimal places)
      const roundedBMI = Math.round(bmi);
      this.aarogyaCampForm.get('BMI')?.setValue(roundedBMI);
      this.updateBMIStatus(bmi); // Optionally keep the full value for other uses
    }
  }

  updateBMIStatus(bmi: number): void {
    let BMIReadings = '';

    if (bmi < 18.5) {
      BMIReadings = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      BMIReadings = 'Normal weight';
    } else if (bmi >= 25 && bmi <= 29.9) {
      BMIReadings = 'Overweight';
    } else if (bmi >= 30) {
      BMIReadings = 'Obesity';
    }

    this.aarogyaCampForm.get('BMIReadings')?.setValue(BMIReadings);
  }

  onHBChangeAarogyaCamp(): void {
    const hbValue = this.aarogyaCampForm.get('HB')?.value;

    let HBReadings = '';
    if (hbValue >= 11 && hbValue <= 11.9) {
      HBReadings = 'Mild Anaemia';
    } else if (hbValue >= 8 && hbValue <= 10.9) {
      HBReadings = 'Moderate Anaemia';
    } else if (hbValue < 8) {
      HBReadings = 'Severe Anaemia';
    } else if (hbValue > 11.9) {
      HBReadings = 'Healthy (No Anaemia)';
    }

    this.aarogyaCampForm.patchValue({
      HBReadings: HBReadings,
    });
  }

  update(): void {
    if (this.aarogyaCampForm.valid && this.selectedId) {
      const aarogyaCampData = this.aarogyaCampForm.value;

      const selectedVillage = this.villages.find(village => village.id === +aarogyaCampData.village);
      if (selectedVillage) {
        aarogyaCampData.village = selectedVillage.name; // Set the village name instead of ID
      }
      const selectedSubVillage = this.aarogyaCampForm.get('villageName')?.value;
      aarogyaCampData.villageName = selectedSubVillage; // This should be a string

      this.service.updateADCampData(this.selectedId, aarogyaCampData).subscribe(
        () => {
          this.toastr.success('Aarogya dhansampada camp data updated successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to update aarogya dhansampada camp data.');
        }
      );
    } else {
      this.toastr.warning('Please select a record to update.');
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(this.confirmationDialogTemplate);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.selectedId) {
        this.delete();
      }
    });
  }

  delete(): void {
    if (this.selectedId) {
      this.service.deleteADCampData(this.selectedId).subscribe(
        () => {
          this.toastr.success('Aarogya dhansampada camp data deleted successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to delete aarogya dhansampada camp data.');
        }
      );
    }
  }

  loadDetails(adCampId: number): void {
    this.service.getADCampDataById(adCampId).subscribe(
      (response) => {
        const adCampDetails = response.adcamp;
        this.aarogyaCampForm.patchValue(response.adcamp);
        this.selectedId = adCampId;

        // Handle village and sub-village selection
        if (adCampDetails.village) {
          const selectedVillage = this.villages.find(village => village.name === adCampDetails.village);
          if (selectedVillage) {
            this.aarogyaCampForm.patchValue({ village: selectedVillage.id });
            this.onMainVillageChange({ target: { value: selectedVillage.id } });

            // Patch sub-village directly if present
            if (adCampDetails.villageName) {
              this.aarogyaCampForm.patchValue({ villageName: adCampDetails.villageName });
            }
          }
        }
      },
      () => {
        this.toastr.error('Failed to load aarogya dhansampada camp details.');
      }
    );
  }

  resetForm(): void {
    this.aarogyaCampForm.reset();
    this.selectedId = null;
  }
}

