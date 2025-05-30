import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-all-camps',
  templateUrl: './all-camps.component.html',
  styleUrls: ['./all-camps.component.scss']
})
export class AllCampsComponent {
  currentForm: string = 'ncd-eye-screening';
  public dataLoaded: boolean = false;
  clientName: string = '';
  clients: any[] = [];

  // Variables for Eye Screening Table
  totalRecords1: number = 0;
  pageSize1: number = 50;
  pageIndex1: number = 0;
  dataSource1 = new MatTableDataSource<any>();
  displayedColumns1: string[] = ['action', 'SrNo', 'client_name', 'name', 'village', 'subvillage', 'date',
    'month', 'year', 'gender', 'age', 'contact', 'code', 'Description', 'Opinion'];

  // Variables for HB Screening Table
  totalRecords2: number = 0;
  pageSize2: number = 50;
  pageIndex2: number = 0;
  dataSource2 = new MatTableDataSource<any>();
  displayedColumns2: string[] = ['action', 'SrNo', 'client_name', 'name', 'village', 'subvillage', 'date',
    'month', 'year', 'gender', 'age', 'contact', 'HB', 'HBReadings'];

  // Variables for Aarogya Camp Table
  totalRecords3: number = 0;
  pageSize3: number = 50;
  pageIndex3: number = 0;
  dataSource3 = new MatTableDataSource<any>();
  displayedColumns3: string[] = ['action', 'SrNo', 'client_name', 'name', 'village', 'subvillage', 'date', 'month',
    'year', 'age', 'contact', 'standard', 'weight', 'height', 'HB', 'HBReadings', 'BMI', 'BMIReadings'];

  // Variables for Mega Camp Table
  totalRecords4: number = 0;
  pageSize4: number = 50;
  pageIndex4: number = 0;
  dataSource4 = new MatTableDataSource<any>();
  displayedColumns4: string[] = ['action', 'SrNo', 'client_name', 'name', 'village', 'villagename', 'date', 'day',
    'month', 'year', 'gender', 'age', 'contact', 'weight', 'height', 'bp', 'pulse', 'temperature',
    'bloodtest', 'hb', 'xray', 'ecg', 'eyetest', 'audiometry', 'spirometry', 'breastcancer',
    'cervicalcancer', 'oralcancer', 'tb', 'description'];

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;
  @ViewChild('paginator4') paginator4!: MatPaginator;

  selectedYear: string = '';
  selectedFromMonth: string = '';
  selectedToMonth: string = '';
  searchKey: string = '';

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: string[] = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadEyeScreeningData();
    this.loadHBScreeningData();
    this.loadAarogyaCampData();
    this.loadMegaCampData();

    this.service.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
      }
    });
  }

  // Function to load Eye Screening Data
  loadEyeScreeningData(): void {
    const startIndex = this.pageIndex1 * this.pageSize1;
    this.service.getEyeCampRecords(startIndex, this.pageSize1).subscribe({
      next: (response) => {
        this.dataSource1.data = response.patients || [];
        this.totalRecords1 = response.total_records || 0;
        if (this.paginator1) {
          this.paginator1.length = this.totalRecords1;
        }
      },
      error: (error) => {
        console.error('Error loading Eye Screening data:', error);
      },
      complete: () => {
        console.log('Eye Screening data loaded');
      }
    });
  }

  // Function to load HB Screening Data
  loadHBScreeningData(): void {
    const startIndex = this.pageIndex2 * this.pageSize2;
    this.service.getHBCampRecords(startIndex, this.pageSize2).subscribe({
      next: (response) => {
        this.dataSource2.data = response.patients || [];
        this.totalRecords2 = response.total_records || 0;
        if (this.paginator2) {
          this.paginator2.length = this.totalRecords2;
        }
      },
      error: (error) => {
        console.error('Error loading HB Screening data:', error);
      },
      complete: () => {
        console.log('HB Screening data loaded');
      }
    });
  }

  // Function to load Aarogya Camp Data
  loadAarogyaCampData(): void {
    const startIndex = this.pageIndex3 * this.pageSize3;
    this.service.getAarogyaCampRecords(startIndex, this.pageSize3).subscribe({
      next: (response) => {
        this.dataSource3.data = response.patients || [];
        this.totalRecords3 = response.total_records || 0;
        if (this.paginator3) {
          this.paginator3.length = this.totalRecords3;
        }
      },
      error: (error) => {
        console.error('Error loading Aarogya Camp data:', error);
      },
      complete: () => {
        console.log('Aarogya Camp data loaded');
      }
    });
  }

  // Function to load Mega Camp Data
  loadMegaCampData(): void {
    const startIndex = this.pageIndex4 * this.pageSize4;
    this.service.getMegaCampRecords(startIndex, this.pageSize4).subscribe({
      next: (response) => {
        this.dataSource4.data = response.patients || [];
        this.totalRecords4 = response.total_records || 0;
        if (this.paginator4) {
          this.paginator4.length = this.totalRecords4;
        }
      },
      error: (error) => {
        console.error('Error loading Mega Camp data:', error);
      },
      complete: () => {
        console.log('Mega Camp data loaded');
      }
    });
  }

  // Handle page change for Eye Screening Table
  onPageChange1(event: PageEvent): void {
    this.pageIndex1 = event.pageIndex;
    this.pageSize1 = event.pageSize;
    this.loadEyeScreeningData();
  }

  // Handle page change for HB Screening Table
  onPageChange2(event: PageEvent): void {
    this.pageIndex2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.loadHBScreeningData();
  }

  // Handle page change for Aarogya Camp Table
  onPageChange3(event: PageEvent): void {
    this.pageIndex3 = event.pageIndex;
    this.pageSize3 = event.pageSize;
    this.loadAarogyaCampData();
  }

  // Handle page change for Mega Camp Table
  onPageChange4(event: PageEvent): void {
    this.pageIndex4 = event.pageIndex;
    this.pageSize4 = event.pageSize;
    this.loadMegaCampData();
  }

  searchEyeCampRecords(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex1 = 0;
    if (this.paginator1) {
      this.paginator1.pageIndex = 0;
    }

    if (filterValue) {
      this.service.searchEyeCampRecords(filterValue, this.selectedFromMonth, this.selectedToMonth, this.selectedYear, this.clientName).subscribe({
        next: (response) => {
          this.dataSource1.data = response.patients || [];
          this.totalRecords1 = response.total_records || 0;
          if (this.paginator1) {
            this.paginator1.length = this.totalRecords1;
            this.paginator1.pageIndex = 0;
          }
        },
        error: (error) => {
          console.error('Error searching records:', error);
        }
      });
    } else {
      this.loadEyeScreeningData();
    }
  }

  searchHBCampRecords(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex2 = 0;
    if (this.paginator2) {
      this.paginator2.pageIndex = 0;
    }

    if (filterValue) {
      this.service.searchHBCampRecords(filterValue, this.selectedFromMonth, this.selectedToMonth, this.selectedYear, this.clientName).subscribe({
        next: (response) => {
          this.dataSource2.data = response.patients || [];
          this.totalRecords2 = response.total_records || 0;
          if (this.paginator2) {
            this.paginator2.length = this.totalRecords2;
            this.paginator2.pageIndex = 0;
          }
        },
        error: (error) => {
          console.error('Error searching records:', error);
        }
      });
    } else {
      this.loadHBScreeningData();
    }
  }

  searchADCampRecords(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex3 = 0;
    if (this.paginator3) {
      this.paginator3.pageIndex = 0;
    }

    if (filterValue) {
      this.service.searchADCampRecords(filterValue, this.selectedFromMonth, this.selectedToMonth, this.selectedYear, this.clientName).subscribe({
        next: (response) => {
          this.dataSource3.data = response.patients || [];
          this.totalRecords3 = response.total_records || 0;
          if (this.paginator3) {
            this.paginator3.length = this.totalRecords3;
            this.paginator3.pageIndex = 0;
          }
        },
        error: (error) => {
          console.error('Error searching records:', error);
        }
      });
    } else {
      this.loadAarogyaCampData();
    }
  }

  searchMegaCampRecords(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex4 = 0;
    if (this.paginator4) {
      this.paginator4.pageIndex = 0;
    }

    if (filterValue) {
      this.service.searchMegaCampRecords(filterValue, this.selectedFromMonth, this.selectedToMonth, this.selectedYear, this.clientName).subscribe({
        next: (response) => {
          this.dataSource4.data = response.patients || [];
          this.totalRecords4 = response.total_records || 0;
          if (this.paginator4) {
            this.paginator4.length = this.totalRecords4;
            this.paginator4.pageIndex = 0;
          }
        },
        error: (error) => {
          console.error('Error searching records:', error);
        }
      });
    } else {
      this.loadMegaCampData();
    }
  }

  editEyeCamp(id: number): void {
    this.router.navigate(['/edit_eye_camp', id]);
  }
  editHBCamp(id: number): void {
    this.router.navigate(['/edit_hb_camp', id]);
  }
  editADCamp(id: number): void {
    this.router.navigate(['/edit_ad_camp', id]);
  }
  editMegaCamp(id: number): void {
    this.router.navigate(['/edit_mega_camp', id]);
  }
}
