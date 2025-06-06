import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-addusersby-admin',
  templateUrl: './addusersby-admin.component.html',
  styleUrls: ['./addusersby-admin.component.scss']
})
export class AddusersbyAdminComponent {
  @ViewChild('formDialog') formDialog!: TemplateRef<any>;
  userForm!: FormGroup;
  users: any[] = [];
  showForm = false;
  isEditMode = false;
  currentUserId: string | null = null;
  currentForm!: string;
  public dataLoaded: boolean = false;
  displayedColumns1: string[] = ['id', 'name', 'client_name', 'action'];
  dataSource1!: MatTableDataSource<any>;
  displayedColumns2: string[] = ['id', 'name', 'action'];
  dataSource2!: MatTableDataSource<any>;
  displayedColumns3: string[] = ['id', 'name', 'action'];
  dataSource3!: MatTableDataSource<any>;
  displayedColumns4: string[] = ['id', 'name', 'address', 'no_of_villages', 'onboarding_date', 'action'];
  dataSource4!: MatTableDataSource<any>;
  villages: any;
  diseases: any;
  medicines: any;
  clients: any;
  role!: string;
  constructor(private fb: FormBuilder, private userService: ServiceService, private toastr: ToastrService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      mobileno: ['', [Validators.required, Validators.min(0)]]
    });

    this.getAllUsers();
    this.getAllClientsAndVillages();
    this.getAllDiseases();
    this.getAllMedicines();
    this.getAllClients();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.isEditMode = false;
    this.userForm.reset();
  }

  openFormDialog(user: any = null): void {
    this.isEditMode = !!user;
    this.currentUserId = user ? user.uid : null;

    if (user) {
      this.userForm.patchValue({
        username: user.username,
        password: user.password,
        mobileno: user.mobileno,
        role: user.role
      });
    } else {
      this.userForm.reset();
    }
    this.dialog.open(this.formDialog);
  }

  getAllUsers(): void {
    this.userService.getallusers().subscribe(
      response => {
        if (response.status === 'success') {
          this.users = response.all_user;
        } else {
          this.toastr.error(response.msg, 'Error');
        }
      },
      error => {
        this.toastr.error(error?.error?.msg || 'Something went wrong', 'Error');
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.isEditMode && this.currentUserId) {
        this.userService.edituser(this.currentUserId, this.userForm.value).subscribe(
          response => {
            if (response.status === 'success') {
              this.toastr.success('Data updated successfully!', 'Success');
              this.dialog.closeAll();
              this.getAllUsers();
            } else {
              this.toastr.error(response.msg, 'Error');
            }
          },
          error => {
            this.toastr.error(error?.error?.msg || 'Something went wrong', 'Error');
          }
        );
      } else {
        this.userService.addusers(this.userForm.value).subscribe(
          response => {
            if (response.status === 'success') {
              this.toastr.success('User created successfully!', 'Success');
              this.dialog.closeAll();
              this.getAllUsers();
            } else {
              this.toastr.error(response.msg, 'Error');
            }
          },
          error => {
            this.toastr.error(error?.error?.msg || 'Something went wrong', 'Error');
          }
        );
      }
    }
  }

  deleteUser(): void {
    if (this.currentUserId) {
      this.userService.deleteUser(this.currentUserId).subscribe(
        response => {
          console.log('Deleted', response);

          if (response.status === 'success') {
            this.toastr.success('User deleted successfully!', 'Success');
            this.dialog.closeAll();
            this.getAllUsers();
          } else {
            this.toastr.error(response.msg, 'Error');
          }
        },
        error => {
          this.toastr.error(error?.error?.msg || 'Something went wrong', 'Error');
        }
      );
    }
  }

  getAllClientsAndVillages() {
    this.userService.getAllClients().subscribe({
      next: (res: any) => {
        this.clients = res.all_clients;

        // Now fetch villages after clients are ready
        this.userService.getAllVillages().subscribe({
          next: (res: any) => {
            this.villages = res.all_Villages;

            // Map client name to each village
            this.villages.forEach((village: any) => {
              const client = this.clients.find((c: any) => c.client_id === village.client);
              village.client_name = client ? client.client_name : 'Unknown';
            });

            this.dataSource1 = new MatTableDataSource(this.villages);
            this.dataLoaded = true;
          },
          error: (err: any) => console.log(err)
        });
      },
      error: (err: any) => console.log(err)
    });
  }

  // getAllVillageList() {
  //   this.userService.getAllVillages().subscribe({
  //     next: (res: any) => {
  //       this.dataLoaded = true;
  //       this.villages = res.all_Villages;
  //       this.dataSource1 = new MatTableDataSource(this.villages);
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //     }
  //   });
  // }

  getAllDiseases() {
    this.userService.getAllDiseases().subscribe({
      next: (res: any) => {
        this.dataLoaded = true;
        this.diseases = res.all_diseases;
        this.dataSource2 = new MatTableDataSource(this.diseases);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getAllMedicines() {
    this.userService.getAllMedicines().subscribe({
      next: (res: any) => {
        this.dataLoaded = true;
        this.medicines = res.all_mediciness;
        this.dataSource3 = new MatTableDataSource(this.medicines);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getAllClients() {
    this.userService.getAllClients().subscribe({
      next: (res: any) => {
        this.dataLoaded = true;
        this.clients = res.all_clients;
        this.dataSource4 = new MatTableDataSource(this.clients);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  editVillages(id: number) {
    this.router.navigate(['/edit_villages/', id]);
  }
  editDiseases(id: number) {
    this.router.navigate(['/edit_diseases/', id]);
  }
  editMedicines(id: number) {
    this.router.navigate(['/edit_medicines/', id]);
  }
  editClients(id: number) {
    this.router.navigate(['/edit_clients/', id]);
  }
}
