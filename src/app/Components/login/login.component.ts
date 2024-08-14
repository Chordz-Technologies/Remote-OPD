import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  passwordFieldType: string = 'password';

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // console.log('Password:', password);
      this.authService.login(username, password).subscribe(
        (response) => {
          if (response.status === 'success') {
            const role = response.role;
            localStorage.setItem('username', response.username);
            // localStorage.setItem('name', response.data.name);
            localStorage.setItem('role', role);
            localStorage.setItem('token', response.token);

            if (role === 'DOCTOR') {
              this.toastr.success('Login as Doctor successfully!!', 'Success');
              this.router.navigate(['/patient_info_form']);
            } else if (role === 'INVESTER') {
              this.toastr.success('Login as Invester successfully!!', 'Success');
              this.router.navigate(['/patient_info_form']);
            } else if (role === 'CPR_CONFIRMER') {
              this.toastr.success('Login as Information CONFIRMER successfully!!', 'Success');
              this.router.navigate(['/getall_admission_for_confirmation']);
            } else if (role === 'CPR_ACCOUNTENT') {
              this.toastr.success('Login as Information ACCOUNTENT successfully!!', 'Success');
              this.router.navigate(['/see_all_pending_admissions']);
            } else if (role === 'ADMIN') {
              this.toastr.success('Login as Admin successfully!!', 'Success');
              this.router.navigate(['/create_role']);
            }
          } else {
            console.log('Login failed', response.msg);
            this.toastr.error('Login failed check credentials ', 'Error');
          }
        },
        (error) => {
          console.error('Login error', error);
          this.toastr.error(
            error?.error?.msg || 'Something Went Wrong ',
            'Error'
          );
        }
      );

    }
  }

}
