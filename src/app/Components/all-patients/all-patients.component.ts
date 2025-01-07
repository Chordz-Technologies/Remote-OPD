import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ServiceService } from 'src/app/shared/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-patients',
  templateUrl: './all-patients.component.html',
  styleUrls: ['./all-patients.component.scss'],
})
export class AllPatientsComponent implements OnInit, AfterViewInit {
  public dataLoaded: boolean = false;
  totalRecords: number = 0;
  pageSize: number = 50;
  pageIndex: number = 0;

  selectedYear: string = '';
  selectedFromMonth: string = '';
  selectedToMonth: string = '';
  searchKey: string = '';

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: string[] = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'action', 'srNo', 'client_name', 'patientName', 'date', 'day', 'week',
    'month', 'year', 'village', 'villageName', 'category', 'gender', 'age',
    'ageGroup', 'mobileNo', 'signSymptoms', 'physicalExamination',
    'investigation', 'diagnosis', 'prescribedMedicine1', 'prescribedMedicine2',
    'dosage', 'treatmentRemark',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event);
      });
    }
  }

  loadData(): void {
    this.dataLoaded = false;
    const startIndex = this.pageIndex * this.pageSize;

    this.service.getFilteredRecords(
      this.selectedYear,
      this.selectedFromMonth,
      this.selectedToMonth,
      startIndex,
      this.pageSize
    ).subscribe({
      next: (response) => {
        if (response) {
          this.dataSource.data = response.patients || [];
          this.totalRecords = response.total_records || 0;
          this.dataLoaded = true;

          if (this.paginator) {
            this.paginator.length = this.totalRecords;
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.dataLoaded = true;
      },
      complete: () => {
        console.log('Data loading completed');
      }
    });
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    if (filterValue) {
      this.service.searchRecords(filterValue, this.selectedFromMonth, this.selectedToMonth, this.selectedYear).subscribe({
        next: (response) => {
          this.dataSource.data = response.patients || [];
          this.totalRecords = response.total_records || 0;
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
            this.paginator.pageIndex = 0;
          }
        },
        error: (error) => {
          console.error('Error searching records:', error);
        }
      });
    } else {
      this.loadData();
    }
  }

  edit(id: number): void {
    this.router.navigate(['/edit_patient_info', id]);
  }
}
