import { Injectable } from '@angular/core';
import { AccessService } from '../../access/service/access.service';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleAccess: any
  roleDetail: any
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  accessUrl: string = environment.accessServiceUrl + "/access/"

  constructor(private accessPrivService: AccessService, private router: Router, private http: HttpClient) { }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole');
  }

  isVerified(): boolean {
    return !!localStorage.getItem('isVerified');
  }


  accessToken: string = localStorage.getItem('accessToken') || '';
  getAccessToken() { return this.accessToken; }

  refresh() {
    const refreshToken = localStorage.getItem('refreshToken'); // or omit if using HttpOnly cookie
    return this.http.post<any>(`${environment.loginServiceUrl}/login/token`, { refreshToken })
      .pipe(tap(res => {
        this.accessToken = res.accessToken;
        localStorage.setItem('refreshToken', res.refreshToken);
      }));
  }
  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${environment.loginServiceUrl}/login/logout`, { refreshToken }).pipe(tap(() => {
      this.accessToken = null;
      localStorage.removeItem('refreshToken');
    }));
  }
  checkAccess(accKey: string, action: string): Observable<boolean> {
    let role = localStorage.getItem('userRole');
    role = role ? role.replace(/"/g, '') : null;

    if (!role) {
      return of(false);
    }

    return this.http.get<any>(`${this.accessUrl}/getRoleDetails/${role}`).pipe(
      map(response => {
        this.roleAccess = response
        this.roleDetail = this.roleAccess.roleAccess.roleDetails;
        const moduleAccess = this.roleDetail.find((module: any) => module.moduleName === accKey);
        if (!moduleAccess) {
          return false;
        }
        return moduleAccess.accessType[action] === true;
      }),
      catchError(error => {
        return of(false);
      })
    );
  }
}
