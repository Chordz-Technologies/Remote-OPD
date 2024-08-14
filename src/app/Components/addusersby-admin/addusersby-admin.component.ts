import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    private fb: FormBuilder,
    private userService: ServiceService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      mobileno: ['', [Validators.required, Validators.min(0)]]
    });

    this.getAllUsers();
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
              this.toastr.success('User updated successfully!', 'Success');
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
              this.toastr.success('Course created successfully!', 'Success');
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

}
