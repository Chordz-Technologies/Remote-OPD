import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-mega-camp',
  templateUrl: './edit-mega-camp.component.html',
  styleUrls: ['./edit-mega-camp.component.scss']
})
export class EditMegaCampComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;

  megaCampForm!: FormGroup;
  selectedId: number | null = null;
  villages: any[] = [];
  subVillages: string[] = [];
  villageName: string[] = [];
  clients: any[] = [];
  FilteredVillages: any[] = [];

  constructor(private fb: FormBuilder, private service: ServiceService, private dialog: MatDialog,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Initialize the form
    this.megaCampForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      contact: ['',],
      village: ['', Validators.required],
      villagename: ['', Validators.required],
      weight: ['',],
      height: ['',],
      bp: ['',],
      pulse: ['',],
      temperature: ['',],
      bloodtest: ['',],
      hb: ['',],
      xray: ['',],
      ecg: ['',],
      eyetest: ['',],
      audiometry: ['',],
      spirometry: ['',],
      breastcancer: ['',],
      oralcancer: ['',],
      cervicalcancer: ['',],
      tb: ['',],
      description: ['',],
    });

    this.service.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    this.service.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
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

  onCampClientChange(event: any): void {
    const selectedClientId = +event.target.value;

    // Filter villages based on selected client ID
    this.FilteredVillages = this.villages.filter(village => village.client === selectedClientId);

    // Clear previously selected values
    this.megaCampForm.patchValue({ village: '', subvillage: '' });
    this.subVillages = [];
  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    if (!isNaN(selectedDate.getTime())) {
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }); // Get day name (e.g., Monday)
      const month = selectedDate.toLocaleString('en-US', { month: 'long' }); // Get month name (e.g., January)
      const year = selectedDate.getFullYear();
      this.megaCampForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
      });
    }
  }

  update(): void {
    if (this.megaCampForm.valid && this.selectedId) {
      const megaCampData = this.megaCampForm.value;

      const selectedVillage = this.villages.find(village => village.id === +megaCampData.village);
      if (selectedVillage) {
        megaCampData.village = selectedVillage.name; // Set the village name instead of ID
      }
      const selectedSubVillage = this.megaCampForm.get('villageName')?.value;
      megaCampData.villageName = selectedSubVillage; // This should be a string

      // Convert client_id to client_name
      const selectedClient = this.clients.find(client => client.client_id === +megaCampData.client_name);
      if (selectedClient) {
        megaCampData.client_name = selectedClient.client_name;
      }

      this.service.updateMegaCampData(this.selectedId, megaCampData).subscribe(
        () => {
          this.toastr.success('Mega camp data updated successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to update mega camp data.');
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
      this.service.deleteMegaCampData(this.selectedId).subscribe(
        () => {
          this.toastr.success('Mega camp data deleted successfully!');
          this.resetForm();
          this.router.navigate(['/all_camps']);
        },
        () => {
          this.toastr.error('Failed to delete mega camp data.');
        }
      );
    }
  }

  loadDetails(megaCampId: number): void {
    this.service.getMegaCampDataById(megaCampId).subscribe(
      (response) => {
        const megaCampDetails = response.megacamp;
        this.megaCampForm.patchValue(response.megacamp);
        this.selectedId = megaCampId;

        const selectedClient = this.clients.find(
          client => client.client_name === megaCampDetails.client_name
        );
        if (selectedClient) {
          this.megaCampForm.patchValue({ client_name: selectedClient.client_id });
          this.FilteredVillages = this.villages.filter(
            v => v.client === selectedClient.client_id
          );

          // Match village name → ID
          const selectedVillage = this.FilteredVillages.find(
            v => v.name === megaCampDetails.village
          );
          if (selectedVillage) {
            this.megaCampForm.patchValue({ village: selectedVillage.id });

            this.subVillages = selectedVillage.vnames;
            this.villageName = selectedVillage.vnames;

            if (megaCampDetails.villageName) {
              this.megaCampForm.patchValue({ villagename: megaCampDetails.villageName });
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
    this.megaCampForm.reset();
    this.selectedId = null;
  }
}

