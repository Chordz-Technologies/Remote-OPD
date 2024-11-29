import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-diseases',
  templateUrl: './edit-diseases.component.html',
  styleUrls: ['./edit-diseases.component.scss']
})
export class EditDiseasesComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  diseaseForm!: FormGroup;
  selectedDiseaseId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.diseaseForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Check if editing an existing disease
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedDiseaseId = +id;
        this.loadDiseaseDetails(this.selectedDiseaseId);
      }
    });
  }

  submitDisease(): void {
    if (this.diseaseForm.valid) {
      const diseaseData = this.diseaseForm.value;
      this.service.addDiseases(diseaseData).subscribe(
        () => {
          this.toastr.success('Disease added successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to add disease.');
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.');
    }
  }

  updateDisease(): void {
    if (this.diseaseForm.valid && this.selectedDiseaseId) {
      const diseaseData = this.diseaseForm.value;
      this.service.updateDiseases(this.selectedDiseaseId, diseaseData).subscribe(
        () => {
          this.toastr.success('Disease updated successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to update disease.');
        }
      );
    } else {
      this.toastr.warning('Please select a disease to update.');
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(this.confirmationDialogTemplate);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.selectedDiseaseId) {
        this.deleteDisease();
      }
    });
  }

  deleteDisease(): void {
    if (this.selectedDiseaseId) {
      this.service.deleteDiseases(this.selectedDiseaseId).subscribe(
        () => {
          this.toastr.success('Disease deleted successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to delete disease.');
        }
      );
    }
  }

  loadDiseaseDetails(diseaseId: number): void {
    this.service.getDiseaseById(diseaseId).subscribe(
      (response) => {
        this.diseaseForm.patchValue(response.disease);
        this.selectedDiseaseId = diseaseId;
      },
      () => {
        this.toastr.error('Failed to load disease details.');
      }
    );
  }

  resetForm(): void {
    this.diseaseForm.reset();
    this.selectedDiseaseId = null;
  }
}