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
  clients: any[] = [];


  constructor(private fb: FormBuilder, private service: ServiceService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      village: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      client_name: [''],
    });


    // Fetch client names
    this.service.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
      }
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


  // Utility function to get filter values
  getFilterValues() {
    return this.patientForm.value;
  }

  // Utility function to handle the file download
  private downloadFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const downloadURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    link.click();
  }

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


  downloadWeeklyReport() {
    this.service.downloadWeeklyReport().subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Patient Report.xlsx';
      link.click();
    });
  }

  downloadVillageWiseGenderReport() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadVillageWiseGenderReport(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Village Wise Gender Report.xlsx');
    });
  }

  downloadVillageWiseAgeGroupReport() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadVillageWiseAgeGroupReport(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Village Wise Age Group Report.xlsx');
    });
  }

  downloadMonthlySummaryDiseaseTotalCount() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadMonthlySummaryDiseaseTotalCount(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Monthly Summary Report - Village Wise Disease Total Count.xlsx');
    });
  }

  downloadMonthlySummaryMaleFemaleCount() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadMonthlySummaryMaleFemaleCount(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Monthly Summary Report - Disease Wise Week Wise - Male Female Count.xlsx');
    });
  }

  // Download Eye Screening Camp Report
  downloadEyeScreeningCampReport() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadEyeScreeningCampReport(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Eye Screening Camp Report.xlsx');
    });
  }

  // Download HB Screening Camp Report
  downloadHBSreeningCampReport() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadHBSreeningCampReport(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'HB Screening Camp Report.xlsx');
    });
  }

  // Download Aarogya Dhansampada Camp Report
  downloadAarogyaCampReport() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadAarogyaCampReport(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Aarogya Dhansampada Camp Report.xlsx');
    });
  }

  // Download Mega Camp Report
  downloadMegaCampReport() {
    const { village, month, year } = this.getFilterValues();
    this.service.downloadMegaCampReport(village, month, year).subscribe((response: Blob) => {
      this.downloadFile(response, 'Mega Camp Report.xlsx');
    });
  }


}
