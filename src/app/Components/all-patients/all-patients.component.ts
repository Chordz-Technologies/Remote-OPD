import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/shared/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-patients',
  templateUrl: './all-patients.component.html',
  styleUrls: ['./all-patients.component.scss']
})
export class AllPatientsComponent {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['action', 'srNo', 'patientName', 'date', 'villageName', 'category', 'gender', 'age', 'day', 'month', 'ageGroup', 'week', 'mobileNo', 'signSymptoms', 'physicalExamination', 'investigation', 'diagnosis', 'prescribedMedicine1', 'prescribedMedicine2', 'dosage', 'camp', 'treatmentRemark'];

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getAllPatientsData();
  }

  getAllPatientsData() {
    this.service.getAllPatientsData().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.patients);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id: number) {
    this.router.navigate(['/edit_patient_info', id]);
  }
}

