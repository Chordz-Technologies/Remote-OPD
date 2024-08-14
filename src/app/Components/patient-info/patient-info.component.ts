import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
  username: string | null = '';
  patientForm!: FormGroup;

  constructor(private fb: FormBuilder, private patientService: ServiceService,
    private router: Router,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      // srNo: ['', Validators.required],
      patientName: ['', Validators.required],
      date: ['', Validators.required],
      villageName: ['', Validators.required],
      category: ['',],
      gender: ['',],
      age: ['', Validators.required],
      day: ['',],
      month: ['',],
      ageGroup: ['',],
      week: ['',],
      mobileNo: ['', Validators.required],
      signSymptoms: ['',],
      physicalExamination: ['',],
      investigation: ['',],
      diagnosis: ['',],
      prescribedMedicine1: ['',],
      prescribedMedicine2: ['',],
      dosage: ['',],
      treatmentRemark: ['',],
    });

    this.username = localStorage.getItem('username');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonData = JSON.parse(e.target.result);
        this.patientForm.patchValue(jsonData);
      };
      reader.readAsText(file);
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      this.patientService.addopdform(patientData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Patient data submitted successfully!', 'Success');
            this.patientForm.reset();
          } else {
            this.toastr.error(response.msg, 'Error');
          }

          this.patientForm.reset(); // Optionally reset the form
        },
        (error) => {
          // Handle error response
          this.toastr.error(error?.error?.msg || 'Something went wrong',
            'Error');
          console.error('Error submitting patient data:', error);
        }
      );
    } else {
      this.toastr.warning('Please fill all required fields.', 'Warning');
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
