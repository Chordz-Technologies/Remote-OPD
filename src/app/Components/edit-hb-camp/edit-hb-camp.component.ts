import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-hb-camp',
  templateUrl: './edit-hb-camp.component.html',
  styleUrls: ['./edit-hb-camp.component.scss']
})
export class EditHbCampComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  hbScreeningForm!: FormGroup;
  selectedId: number | null = null;
  villages: any[] = [];
  subVillages: string[] = [];
  villageName: string[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService, private dialog: MatDialog,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Initialize the form
    this.hbScreeningForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['',],
      village: ['', Validators.required],
      subvillage: ['', Validators.required],
      HB: ['', [Validators.required, Validators.min(1)]], // HB field
      HBReadings: ['', Validators.required], // HB status field
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

  onHBChange(): void {
    const hbValue = this.hbScreeningForm.get('HB')?.value;

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
    this.hbScreeningForm.patchValue({
      HBReadings: HBReadings,
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
      this.hbScreeningForm.patchValue({
        month: month,
        year: year,
      });
    }
  }

  update(): void {
    if (this.hbScreeningForm.valid && this.selectedId) {
      const hbCampData = this.hbScreeningForm.value;

      const selectedVillage = this.villages.find(village => village.id === +hbCampData.village);
      if (selectedVillage) {
        hbCampData.village = selectedVillage.name; // Set the village name instead of ID
      }
      const selectedSubVillage = this.hbScreeningForm.get('villageName')?.value;
      hbCampData.villageName = selectedSubVillage; // This should be a string

      this.service.updateHBCampData(this.selectedId, hbCampData).subscribe(
        () => {
          this.toastr.success('HB camp data updated successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to update hb camp data.');
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
      this.service.deleteHBCampData(this.selectedId).subscribe(
        () => {
          this.toastr.success('HB camp data deleted successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to delete hb camp data.');
        }
      );
    }
  }

  loadDetails(hbCampId: number): void {
    this.service.getHBCampDataById(hbCampId).subscribe(
      (response) => {
        const hbCampDetails = response.hbcamp;
        this.hbScreeningForm.patchValue(response.hbcamp);
        this.selectedId = hbCampId;

        // Handle village and sub-village selection
        if (hbCampDetails.village) {
          const selectedVillage = this.villages.find(village => village.name === hbCampDetails.village);
          if (selectedVillage) {
            this.hbScreeningForm.patchValue({ village: selectedVillage.id });
            this.onMainVillageChange({ target: { value: selectedVillage.id } });

            // Patch sub-village directly if present
            if (hbCampDetails.villageName) {
              this.hbScreeningForm.patchValue({ villageName: hbCampDetails.villageName });
            }
          }
        }
      },
      () => {
        this.toastr.error('Failed to load hb camp details.');
      }
    );
  }

  resetForm(): void {
    this.hbScreeningForm.reset();
    this.selectedId = null;
  }
}

