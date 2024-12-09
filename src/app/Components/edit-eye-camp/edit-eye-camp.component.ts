import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-eye-camp',
  templateUrl: './edit-eye-camp.component.html',
  styleUrls: ['./edit-eye-camp.component.scss']
})
export class EditEyeCampComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  eyeScreeningForm!: FormGroup;
  selectedId: number | null = null;
  villages: any[] = [];
  subVillages: string[] = [];
  villageName: string[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService, private dialog: MatDialog,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Initialize the form
    this.eyeScreeningForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['',],
      village: ['', Validators.required],
      subvillage: ['', Validators.required],
      code: ['', Validators.required],
      Description: ['', Validators.required],
      Opinion: [''],
      month: ['', Validators.required],
      year: ['', Validators.required],
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

  //Eye Screening Camp
  onUniqueCodeChange(event: any): void {
    const selectedUniqueCode = event.target.value.toLowerCase();

    switch (selectedUniqueCode) {
      case 'no fit':
        this.eyeScreeningForm.patchValue({
          Description: 'Cataract detected but patient is not fit for operation'
        });
        break;
      case 'correction':
        this.eyeScreeningForm.patchValue({
          Description: 'Detection of Refractive Index & correction required'
        });
        break;
      case 'healthy':
        this.eyeScreeningForm.patchValue({
          Description: 'No eye illness found - Healthy Eyes'
        });
        break;
      case 'impairment':
        this.eyeScreeningForm.patchValue({
          Description: 'Presbyopia and Vision Impairment'
        });
        break;
      case 'dryness':
        this.eyeScreeningForm.patchValue({
          Description: 'Detection of eye diseases esp. Eye dryness'
        });
        break;
      case 'white part':
        this.eyeScreeningForm.patchValue({
          Description: 'Pterygium (This growth covers the white part of the eye and extends onto the cornea)'
        });
        break;
      default:
        this.eyeScreeningForm.patchValue({ Description: '' });
        break;
    }
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
      this.eyeScreeningForm.patchValue({
        month: month,
        year: year,
      });
    }
  }

  update(): void {
    if (this.eyeScreeningForm.valid && this.selectedId) {
      const eyeCampData = this.eyeScreeningForm.value;

      const selectedVillage = this.villages.find(village => village.id === +eyeCampData.village);
      if (selectedVillage) {
        eyeCampData.village = selectedVillage.name; // Set the village name instead of ID
      }
      const selectedSubVillage = this.eyeScreeningForm.get('villageName')?.value;
      eyeCampData.villageName = selectedSubVillage; // This should be a string

      this.service.updateEyeCampData(this.selectedId, eyeCampData).subscribe(
        () => {
          this.toastr.success('Eye camp data updated successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to update eye camp data.');
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
      this.service.deleteEyeCampData(this.selectedId).subscribe(
        () => {
          this.toastr.success('Eye camp data deleted successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to delete eye camp data.');
        }
      );
    }
  }

  loadDetails(eyeCampId: number): void {
    this.service.getEyeCampDataById(eyeCampId).subscribe(
      (response) => {
        const eyeCampDetails = response.Eyecamp;
        this.eyeScreeningForm.patchValue(response.Eyecamp);
        this.selectedId = eyeCampId;

        // Handle village and sub-village selection
        if (eyeCampDetails.village) {
          const selectedVillage = this.villages.find(village => village.name === eyeCampDetails.village);
          if (selectedVillage) {
            this.eyeScreeningForm.patchValue({ village: selectedVillage.id });
            this.onMainVillageChange({ target: { value: selectedVillage.id } });

            // Patch sub-village directly if present
            if (eyeCampDetails.villageName) {
              this.eyeScreeningForm.patchValue({ villageName: eyeCampDetails.villageName });
            }
          }
        }
      },
      () => {
        this.toastr.error('Failed to load eye camp details.');
      }
    );
  }

  resetForm(): void {
    this.eyeScreeningForm.reset();
    this.selectedId = null;
  }
}
