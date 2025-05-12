import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-clients',
  templateUrl: './edit-clients.component.html',
  styleUrls: ['./edit-clients.component.scss']
})
export class EditClientsComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  clientForm!: FormGroup;
  selectedClientId: number | null = null;

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
    this.clientForm = this.fb.group({
      client_name: ['', Validators.required],
      client_address: ['', Validators.required],
      no_of_villages: ['', Validators.required],
      onboarding_date: ['', Validators.required],
    });

    // Check if editing an existing disease
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedClientId = +id;
        this.loadClientDetails(this.selectedClientId);
      }
    });
  }

  submitClient(): void {
    if (this.clientForm.valid) {
      const ClientData = this.clientForm.value;
      this.service.addClients(ClientData).subscribe(
        () => {
          this.toastr.success('Client added successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to add client.');
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.');
    }
  }

  updateClient(): void {
    if (this.clientForm.valid && this.selectedClientId) {
      const ClientData = this.clientForm.value;
      this.service.updateClients(this.selectedClientId, ClientData).subscribe(
        () => {
          this.toastr.success('Client updated successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to update client.');
        }
      );
    } else {
      this.toastr.warning('Please select a client to update.');
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(this.confirmationDialogTemplate);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.selectedClientId) {
        this.deleteClient();
      }
    });
  }

  deleteClient(): void {
    if (this.selectedClientId) {
      this.service.deleteClients(this.selectedClientId).subscribe(
        () => {
          this.toastr.success('Client deleted successfully!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.toastr.error('Failed to delete client.');
        }
      );
    }
  }

  loadClientDetails(clientId: number): void {
    this.service.getClientsById(clientId).subscribe(
      (response) => {
        this.clientForm.patchValue(response.client_details);
        this.selectedClientId = clientId;
      },
      () => {
        this.toastr.error('Failed to load client details.');
      }
    );
  }

  resetForm(): void {
    this.clientForm.reset();
    this.selectedClientId = null;
  }
}