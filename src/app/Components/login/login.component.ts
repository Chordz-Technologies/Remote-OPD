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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) { }

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
      this.authService.login(username, password).subscribe(
        (response) => {
          if (response.status === 'success') {
            const role = response.role;
            localStorage.setItem('username', response.username);
            localStorage.setItem('role', role);
            localStorage.setItem('token', response.token);

            if (role === 'DOCTOR') {
              this.toastr.success('Login as Doctor successfully!', 'Success');
              this.router.navigate(['/patient_info_form']);
            } else if (role === 'INVESTOR') {
              this.toastr.success('Login as Investor successfully!', 'Success');
              this.router.navigate(['/all_reports']);
            } else if (role === 'ADMIN') {
              this.toastr.success('Login as Admin successfully!', 'Success');
              this.router.navigate(['/dashboard']);
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
        });
    }
  }
}
