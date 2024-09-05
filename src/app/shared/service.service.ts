import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
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
      headers
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
    return this.http.put<any>(`${this.url}/user/updateuser/${userId}/`, user, { headers });
  }

  //delete user by admin
  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.url}/user/deleteuser/${id}/`, { headers });
  }

  //download excel repot of patient data
  downloadPatientReport(): Observable<Blob> {
    return this.http.get(`${this.url}/patient/excelreport/`, { responseType: 'blob' });
  }

  // downloadPatientReport(): Observable<Blob> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   return this.http.get(`${this.url}/patient/excelreport/`, {
  //     headers: headers,
  //     responseType: 'blob' // Set the response type to 'blob' for binary data
  //   });
  // }

  //all patients info
  getAllPatientsData(): Observable<any> {
    return this.http.get<any>(`${this.url}/patient/allopdforms/`);
  }

  getPatientDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/patient/opdform/${id}/`);
  }

  updatePatient(data: any, id: number) {
    return this.http.put<any>(`${this.url}/patient/opdform/${id}/update/`, data);
  }

  getAllVillages(): Observable<any> {
    return this.http.get<any>(`${this.url}/villages/allvillages/`);
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
}
