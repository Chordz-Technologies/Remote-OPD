import { Component } from '@angular/core';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.scss']
})
export class AllReportsComponent {

  constructor(private service: ServiceService) { }

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
