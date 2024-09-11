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
  roleAccess:any
  roleDetail:any
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  accessUrl:string=environment.accessServiceUrl+"/access/"

  constructor(private accessPrivService: AccessService,private router:Router,private http:HttpClient) {}



 isLoggedIn(): boolean {
    // Logic to check if the user is logged in
    return !!sessionStorage.getItem('userRole');
  }

  isVerified(): boolean {
    // Logic to check if the user is verified, based on your app's implementation
    return !!sessionStorage.getItem('isVerified');  // Example: Check verification status from sessionStorage
  }

  checkAccess(accKey: string, action: string): Observable<boolean> {
    let role = sessionStorage.getItem('userRole');
    role = role ? role.replace(/"/g, '') : null; // Clean up role string

    if (!role) {
      return of(false); // If no role found, deny access
    }

    return this.http.get<any>(`${this.accessUrl}/getRoleDetails/${role}`).pipe(
      map(response => {
        this.roleAccess=response
        this.roleDetail = this.roleAccess.roleAccess.roleDetails;
        console.log(this.roleDetail);
        console.log(accKey);
        const moduleAccess = this.roleDetail.find((module: any) => module.moduleName === accKey);
     
        
        
        if (!moduleAccess) {
          return false;  // Deny access if the module isn't found
        }

        // Return true if the action (create, view, etc.) is allowed
        return moduleAccess.accessType[action] === true;
      }),
      catchError(error => {
        console.error('Error fetching role access:', error);
        return of(false);  // Deny access in case of an error
      })
    );
  }
}
