import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  years: string[] = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  clients: any[] = [];


  constructor(private fb: FormBuilder, private service: ServiceService, private toastr: ToastrService) { }

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

  downloadAllPatientExcelsheet() {
    this.service.downloadAllPatientExcelsheet().subscribe((response: Blob) => {
      this.downloadFile(response, 'All Patient Excelsheet.xlsx');
    });
  }

  downloadWeeklyExcelsheet() {
    this.service.downloadWeeklyExcelsheet().subscribe((response: Blob) => {
      this.downloadFile(response, 'Weekly Patient Excelsheet.xlsx');
    });
  }

  downloadEyeCampExcelsheet() {
    this.service.downloadEyeCampExcelsheet().subscribe((response: Blob) => {
      this.downloadFile(response, 'Eye Camp Excelsheet.xlsx');
    });
  }

  downloadHBCampExcelsheet() {
    this.service.downloadHBCampExcelsheet().subscribe((response: Blob) => {
      this.downloadFile(response, 'HB Camp Excelsheet.xlsx');
    });
  }

  downloadAarogyaCampExcelsheet() {
    this.service.downloadAarogyaCampExcelsheet().subscribe((response: Blob) => {
      this.downloadFile(response, 'Aarogya Dhansampada Camp Excelsheet.xlsx');
    });
  }

  downloadMegaCampExcelsheet() {
    this.service.downloadMegaCampExcelsheet().subscribe((response: Blob) => {
      this.downloadFile(response, 'Mega Camp Excelsheet.xlsx');
    });
  }

  downloadMonthWisePatientReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadMonthWisePatientReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Month Wise Patient Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadMonthWiseWeeklyReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadMonthWiseWeeklyReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Month Wise Weekly Patient Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadVillageWiseGenderReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadVillageWiseGenderReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Village Wise Gender Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadVillageWiseAgeGroupReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadVillageWiseAgeGroupReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Village Wise Age Group Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadVillageWiseCategoryReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadVillageWiseCategoryReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Village Wise Category Wise Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadMonthlySummaryDiseaseTotalCount() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadMonthlySummaryDiseaseTotalCount(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Monthly Summary Report - Village Wise Disease Total Count.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadMonthlySummaryMaleFemaleCount() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadMonthlySummaryMaleFemaleCount(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Monthly Summary Report - Disease Wise Week Wise - Male Female Count.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  // Download Eye Screening Camp Report
  downloadEyeScreeningCampReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadEyeScreeningCampReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Eye Screening Camp Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  // Download HB Screening Camp Report
  downloadHBSreeningCampReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadHBSreeningCampReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'HB Screening Camp Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  // Download Aarogya Dhansampada Camp Report
  downloadADCampBMIReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadADCampBMIReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Aarogya Dhansampada Camp BMI Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  downloadADCampHBReport() {
    const { village, month, year, client_name } = this.getFilterValues();
    this.service.downloadADCampHBReport(village, month, year, client_name).subscribe((response: Blob) => {
      this.downloadFile(response, 'Aarogya Dhansampada Camp HB Report.xlsx');
    },
      (error) => {
        this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
      });
  }

  // Download Mega Camp Report
  // downloadMegaCampReport() {
  //   const { village, month, year, client_name } = this.getFilterValues();
  //   this.service.downloadMegaCampReport(village, month, year, client_name).subscribe((response: Blob) => {
  //     this.downloadFile(response, 'Mega Camp Report.xlsx');
  //   },
  //     (error) => {
  //       this.toastr.error('Please Select Year, Month, Village Name & Client Name.', 'Error');
  //     });
  // }
}
