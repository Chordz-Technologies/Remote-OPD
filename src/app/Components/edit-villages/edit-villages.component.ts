import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { village_model } from 'models';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';


@Component({
  selector: 'app-edit-villages',
  templateUrl: './edit-villages.component.html',
  styleUrls: ['./edit-villages.component.scss']
})
export class EditVillagesComponent implements OnInit {
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate!: TemplateRef<any>;
  editSubVillageControl = new FormControl();

  villageForm!: FormGroup;
  villageID!: number;
  village_model: village_model = new village_model();

  showsubmit!: boolean;
  showupdate!: boolean;
  showdelete!: boolean;

  villageDetails: any = {};
  editingIndex: number = -1;

  displayedColumns: string[] = ['subvillage', 'action'];
  dataSource!: MatTableDataSource<any>;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private service: ServiceService,
    private route: ActivatedRoute, private router: Router,
    private cdr: ChangeDetectorRef, private toastr: ToastrService,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.villageForm = this.fb.group({
      village: [''],
      subvillage: ['']

    })

    this.dataSource = new MatTableDataSource<any>([]);

    this.route.params.subscribe(val => {
      this.villageID = val['id']; // Assuming the parameter name is 'id'
      // Fetch the product details using the ID and populate the form

      this.service.getVillageById(this.villageID).subscribe({
        next: (res) => {
          this.onEdit(res.Villages);
          this.villageDetails = res.Villages;
          this.dataSource = new MatTableDataSource(this.villageDetails.vnames.map((vnames: string) => ({ vnames })));
          // this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, error: (err) => {
          console.log(err)
        }
      })
    });

    this.showsubmit = true;
    this.showupdate = false;
    this.showdelete = false;

  }

  onEdit(Village: village_model) {
    this.showsubmit = false;
    this.showupdate = true;
    this.showdelete = true;
    this.villageForm.setValue({
      village: Village.name,
      subvillage: Village.vnames,
    })
    this.villageForm.get('subvillage')?.setValue('');

  }
  //edit village
  updateVillage() {
    // Populate the village_model with form values
    this.village_model.name = this.villageForm.value.village;

    // Convert the array of subcategories into a comma-separated string
    this.village_model.vnames = this.villageDetails.vnames.join(', ');

    // Call the service to update the village details
    this.service.updateVillage(this.village_model, this.villageID,).subscribe({
      next: (res) => {
        console.log(res);
        // alert('Update village Successful');
        this.toastr.success('Update Village Successful!', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating village:', err);
        // Optionally, display an error message to the user
        // You can also handle specific error cases if needed
      }
    });
  }

  //post Village
  submitVillage() {
    // Check if village name field is empty
    if (!this.villageForm.value.village) {
      this.toastr.error('Please enter village name', 'Error');
      return; // Stop further execution
    }

    // Populate the village_model with form values
    this.village_model.name = this.villageForm.value.village;

    // Convert the array of subcategories into a comma-separated string
    this.village_model.vnames = this.villageDetails.vnames.join(', ');

    // Call the service to post the village details
    this.service.addVillage(this.village_model).subscribe({
      next: (res) => {
        console.log(res);
        // alert('Add village Successful');
        this.toastr.success('Add village Successful!', 'Success');
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.error('Error adding village:', err);
        // Optionally, display an error message to the user
        // You can also handle specific error cases if needed
        this.toastr.error('Error adding village', 'Error');
      }
    });
  }

  // delete Village
  deleteVillage() {
    this.service.deleteVillageById(this.villageID).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success('Delete Village Successful!', 'Success');
        this.villageForm.reset();
        this.router.navigate(['dashboard']);
      },
      (err) => {
        this.toastr.error('Delete Failed', 'Error');
      }
    );
  }


  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(this.confirmationDialogTemplate, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed the deletion, call your deleteVillage method here
        this.deleteVillage();
      }
    });
  }

  // edit sub Village row
  editSubVillage(row: any) {
    const index = this.dataSource.data.indexOf(row);
    if (this.editingIndex === index) {
      // If the same row is clicked again, reset the editing index to cancel edit mode
      this.editingIndex = -1;
      this.editSubVillageControl.reset();
    } else {
      // Otherwise, set the editing index and load the row data into the form control
      this.editingIndex = index;
      this.editSubVillageControl.setValue(row.vnames);
    }
  }
  // save edited
  saveSubVillage() {
    if (this.editingIndex !== -1) {
      // Get the edited subvillage value from the form control
      const editedSubvillage = this.editSubVillageControl.value;

      // Update the corresponding subvillage in the villageDetails.vnames array
      this.villageDetails.vnames[this.editingIndex] = editedSubvillage;

      // Update the data source to reflect the changes
      this.dataSource.data[this.editingIndex].vnames = editedSubvillage;

      // Reset the editing index and form control
      this.editingIndex = -1;
      this.editSubVillageControl.reset();

      // Optionally, you can call updateVillage here if you want to persist edits immediately
      this.toastr.success('Sub-village updated successfully!', 'Success');
    } else {
      console.error('Invalid index for saving subvillage');
    }
  }

  // delete sub village
  deleteSubVillage(index: number) {
    if (index >= 0 && index < this.dataSource.data.length) {
      const deletedSubvillage = this.dataSource.data[index].vnames;

      // Remove the subvillage from the data source array
      this.dataSource.data.splice(index, 1);

      // Update the villageDetails.vnames array with the changes
      this.villageDetails.vnames = this.dataSource.data.map((item: any) => item.vnames);

      // Optionally, update the village details if needed
      this.updateVillage();
      this.toastr.success('Delete Sub-village Successful!', 'Success');

      // Reset form and editing index if the deleted row was being edited
      if (this.editingIndex === index) {
        this.editingIndex = -1; // Reset the editing index
        this.editSubVillageControl.reset(); // Reset the form control
      }

      console.log('Deleted subvillage:', deletedSubvillage);
      console.log('Remaining data:', this.dataSource.data);
    } else {
      console.error('Invalid index for deleting subvillage');
    }

    // Manually trigger change detection to ensure the UI is updated
    this.cdr.detectChanges();
  }

  // add new sub Village
  addNewSubVillage() {
    const newSubVillage = this.villageForm.value.subvillage.trim(); // Corrected line
    if (newSubVillage) {
      // Check if this.villageDetails.vnames is undefined or not an array
      if (!Array.isArray(this.villageDetails.vnames)) {
        // If it's not an array or undefined, initialize it as an empty array
        this.villageDetails.vnames = [];
      }
      // Now it's safe to push the new subVillage
      this.villageDetails.vnames.push(newSubVillage);
      this.dataSource.data = [...this.villageDetails.vnames.map((vnames: string) => ({ vnames }))];
      this.villageForm.patchValue({ subvillage: '' }); // Clear the input field after adding
      this.toastr.success('Add Sub-Village Successful!', 'Success');
    } else {
      console.error('New sub village cannot be empty');
      this.toastr.error('New sub village cannot be empty', 'Error'); // Show error toast
    }
  }
}


