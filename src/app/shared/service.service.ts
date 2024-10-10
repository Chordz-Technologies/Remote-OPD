import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Post/Create branch holder with bearer token
  addopdform(patientData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.url}/patient/addopdform/`, patientData, {
      headers,
    });
  }

  //add users by admin
  addusers(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.url}/user/adduser/`, user, { headers });
  }

  //get all Users for admin
  getallusers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.url}/user/getallusers/`, { headers });
  }

  //update or edit user by admin
  edituser(userId: string, user: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`${this.url}/user/updateuser/${userId}/`, user, {
      headers,
    });
  }

  //delete user by admin
  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.url}/user/deleteuser/${id}/`, {
      headers,
    });
  }

  //download excel repot of patient data
  downloadAllPatientExcelsheet(): Observable<Blob> {
    return this.http.get(`${this.url}/patient/excelreport/`, {
      responseType: 'blob',
    });
  }

  //download exel report of patient weekly report
  downloadWeeklyExcelsheet(): Observable<Blob> {
    return this.http.get(`${this.url}/patient/weeklyreport/`, {
      responseType: 'blob',
    });
  }

  downloadEyeCampExcelsheet(): Observable<Blob> {
    return this.http.get(`${this.url}/eyecamp/eyecampExcelsheet/`, {
      responseType: 'blob',
    });
  }

  downloadHBCampExcelsheet(): Observable<Blob> {
    return this.http.get(`${this.url}/hbcamp/hbcampExcelsheet/`, {
      responseType: 'blob',
    });
  }

  downloadAarogyaCampExcelsheet(): Observable<Blob> {
    return this.http.get(`${this.url}/reports/aarogyaDhansampada/`, {
      responseType: 'blob',
    });
  }

  downloadMegaCampExcelsheet(): Observable<Blob> {
    return this.http.get(`${this.url}/reports/megaCamp/`, {
      responseType: 'blob',
    });
  }

  downloadMonthWisePatientReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/patient/FilteredExcelReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  downloadMonthWiseWeeklyReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/patient/FilteredWeeklyReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download village-wise gender report with filters
  downloadVillageWiseGenderReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/patient/VillageWiseGenderReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download village-wise age group report with filters
  downloadVillageWiseAgeGroupReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/patient/VillageWiseAgeGroupReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download monthly summary report - disease total count
  downloadMonthlySummaryDiseaseTotalCount(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/patient/MonthlySummaryReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download monthly summary report - disease-wise week-wise male-female count
  downloadMonthlySummaryMaleFemaleCount(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/patient/SummaryDiseaseWiseWeeklyReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    }
    );
  }

  // Download NCD – Eye Screening Camp Report
  downloadEyeScreeningCampReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/eyecamp/eyecampMonthlyReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download NCD – Village Level HB Screening Camp Report
  downloadHBSreeningCampReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/hbcamp/hbcampReport/`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download Aarogya Dhansampada Camp Report
  downloadAarogyaCampReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/reports/aarogyaDhansampada`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  // Download Mega Camp Report
  downloadMegaCampReport(village: string, month: string, year: string, client_name: string): Observable<Blob> {
    return this.http.get(`${this.url}/reports/megaCamp`, {
      responseType: 'blob',
      params: { village, month, year, client_name },
    });
  }

  //get client Name
  getClientNames(): Observable<any> {
    return this.http.get(`${this.url}/client/allclients/`);
  }

  //all patients info
  searchRecords(searchTerm: string, fromMonth: string, toMonth: string): Observable<any> {
    if (!searchTerm || searchTerm.trim() === '') {
      return new Observable<any>(observer => {
        observer.next({ patients: [], total_records: 0 });
        observer.complete();
      });
    }
    return this.http.get(`${this.url}/patient/opdsearch/?from_month=${fromMonth}&to_month=${toMonth}&search_term=${searchTerm}`);
  }


  getFilteredRecords(year: string, fromMonth: string, toMonth: string, pageIndex: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set('year', year)
      .set('from_month', fromMonth)
      .set('to_month', toMonth)
      .set('start_index', pageIndex.toString())
      .set('limit', pageSize.toString());
    return this.http.get(`${this.url}/patient/opdforms_paginated/`, { params });
  }

  getPatientDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/patient/opdform/${id}/`);
  }

  updatePatient(data: any, id: number) {
    return this.http.put<any>(
      `${this.url}/patient/opdform/${id}/update/`, data);
  }

  getAllVillages(): Observable<any> {
    return this.http.get<any>(`${this.url}/villages/allvillages/`);
  }

  getVillageById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/villages/villagesbyId/${id}/`);
  }

  //add village
  addVillage(village: any): Observable<any> {
    return this.http.post<any>(`${this.url}/villages/createVillage/`, village);
  }

  updateVillage(data: any, id: number) {
    return this.http.put<any>(
      `${this.url}/villages/updateVillage/${id}/update`, data);
  }

  deleteVillageById(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/villages/deleteVillage/${id}/`, id);
  }

  getAllDiseases(): Observable<any> {
    return this.http.get<any>(`${this.url}/disease/alldisease/`);
  }

  getAllMedicines(): Observable<any> {
    return this.http.get<any>(`${this.url}/medicines/allmedicines/`);
  }

  getAllCamps(): Observable<any> {
    return this.http.get<any>(`${this.url}/camps/allcamps/`);
  }

  postEyeCampForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/eyecamp/addeyecamp/`, data);
  }

  postHBCampForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/hbcamp/addhbcamp/`, data);
  }

  postAarogyaCampForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/`, data);
  }

  postMegaCampForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/`, data);
  }

  // Get Patient past data
  getPatientHistory(patientName: string): Observable<any> {
    return this.http.get<any>(`${this.url}/patient/PatientHistory/?patientName=${patientName}`);
  }
}
