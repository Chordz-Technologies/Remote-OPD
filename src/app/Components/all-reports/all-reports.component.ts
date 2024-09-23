import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.scss']
})
export class AllReportsComponent {
  patientForm!: FormGroup;
  villages: string[] = ['Shirwal', 'Talegaon'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: string[] = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  constructor(private fb: FormBuilder, private service: ServiceService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      village: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }
  // ngOnInit(): void {
  //   this.patientForm = this.fb.group({
  //     // villageName: ['', Validators.required],
  //     // month: ['', Validators.required],
  //     // year: ['', Validators.required],
  //   });

  //   // this.service.getAllVillages().subscribe((response: any) => {
  //   //   if (response.status === 'success') {
  //   //     this.villages = response.all_Villages;
  //   //   }
  //   // });
  // }

  downloadPatientReport() {
    this.service.downloadPatientReport().subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Patient Report.xlsx';
      link.click();
    });
  }
}
