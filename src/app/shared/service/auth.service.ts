import { Injectable } from '@angular/core';
import { AccessService } from '../../access/service/access.service';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
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
    return !!sessionStorage.getItem('userRole');
  }

  isVerified(): boolean {
    return !!sessionStorage.getItem('isVerified');
  }

  checkAccess(accKey: string, action: string): Observable<boolean> {
    let role = sessionStorage.getItem('userRole');
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
        console.error('Error fetching role access:', error);
        return of(false);  
      })
    );
  }
}
