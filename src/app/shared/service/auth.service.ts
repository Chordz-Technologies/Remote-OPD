import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiUrl;

  private loginUrl = `${this.url}/user/auth/login/`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap((response) => {
        if (response.status === 'success') {
          console.log(response);

          localStorage.setItem('username', response.username);
          // localStorage.setItem('name', response.name);
          localStorage.setItem('role', response.role);
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  //logout without logout url
  logout(): void {
    localStorage.clear();
  }

  // Get the name of the logged-in user
  getUserName(): string | null {
    return localStorage.getItem('username');
  }

}
