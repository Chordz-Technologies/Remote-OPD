import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string | null = '';
  role!: string | null;


  constructor(
    private router: Router, private toastr: ToastrService, private patientService: ServiceService,
  ) {
    // this.router.navigateByUrl('/user')
  }
  ngOnInit(): void {
    // this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }


  // Assume you have a method to handle login result
  handleLoginResult(result: any) {
    if (result.message === 'Valid User' && result.admin_type === 'Admin') {
      this.isLoggedIn = true;
      this.isAdmin = true;
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }

  downloadExcelReport() {
    this.patientService.downloadExcelReport().subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        const d = new Date();
        a.download = `Shirwal OPD -${d.toLocaleDateString()}-${d.toLocaleTimeString()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastr.success('Excel report downloaded successfully!', 'Success');
      },
      (error) => {
        this.toastr.error('Failed to download Excel report.', 'Error');
        console.error('Error downloading Excel report:', error);
      }
    );
  }


  logout() {
    // Perform logout operations, e.g., clearing tokens, redirecting to login page
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.toastr.success('Logged out successfully!', 'Success');
    // Navigate to the login page or home page after logout
    this.router.navigate(['/login']); // Uncomment and add Router to constructor
  }

}