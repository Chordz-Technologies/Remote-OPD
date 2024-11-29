import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-medicines',
  templateUrl: './edit-medicines.component.html',
  styleUrls: ['./edit-medicines.component.scss']
})
export class EditMedicinesComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  medicineForm!: FormGroup;
  selectedMedicineId: number | null = null;

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
    this.medicineForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Check if editing an existing disease
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedMedicineId = +id;
        this.loadMedicineDetails(this.selectedMedicineId);
      }
    });
  }

  submitMedicine(): void {
    if (this.medicineForm.valid) {
      const MedicineData = this.medicineForm.value;
      this.service.addMedicines(MedicineData).subscribe(
        () => {
          this.toastr.success('Medicine added successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to add medicine.');
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.');
    }
  }

  updateMedicine(): void {
    if (this.medicineForm.valid && this.selectedMedicineId) {
      const MedicineData = this.medicineForm.value;
      this.service.updateMedicines(this.selectedMedicineId, MedicineData).subscribe(
        () => {
          this.toastr.success('Medicine updated successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to update medicine.');
        }
      );
    } else {
      this.toastr.warning('Please select a medicine to update.');
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(this.confirmationDialogTemplate);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.selectedMedicineId) {
        this.deleteMedicine();
      }
    });
  }

  deleteMedicine(): void {
    if (this.selectedMedicineId) {
      this.service.deleteMedicines(this.selectedMedicineId).subscribe(
        () => {
          this.toastr.success('Medicine deleted successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to delete medicine.');
        }
      );
    }
  }

  loadMedicineDetails(medicineId: number): void {
    this.service.getMedicineById(medicineId).subscribe(
      (response) => {
        this.medicineForm.patchValue(response.medicines);
        this.selectedMedicineId = medicineId;
      },
      () => {
        this.toastr.error('Failed to load medicine details.');
      }
    );
  }

  resetForm(): void {
    this.medicineForm.reset();
    this.selectedMedicineId = null;
  }
}