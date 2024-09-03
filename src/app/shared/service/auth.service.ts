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

  // Method to check if user has access to perform a specific action on a module
  // login(username: string, password: string): Observable<any> {
  //   return this.http.post('/api/login', { username, password }).pipe(
  //     map((response: any) => {
  //       if (response.success && response.role) {
  //         sessionStorage.setItem('userRole', JSON.stringify(response.role));
  //         sessionStorage.setItem('token', response.token);
  //         this.isLoggedInSubject.next(true);
  //         return response;
  //       } else {
  //         throw new Error('Invalid role or login credentials');
  //       }
  //     }),
  //     catchError(error => {
  //       console.error('Login failed', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // Check if the user is logged in
  isLoggedIn():boolean {
    return !!sessionStorage.getItem('userRole'); 
   }

  // Logout method
  // Check if the user has access to a module and action
  checkAccess(accKey: string, action: string): Observable<boolean> {
    let role = sessionStorage.getItem('userRole');
    role = role ? role.replace(/"/g, '') : null; // Clean up role string

    if (!role) {
      return of(false); // If no role found, deny access
    }

    // return this.accessPrivService.getAccessByRole(role).pipe( // Modify with your actual access API
    //   map(response => {
    //     this.roleAccess=response
    //     this.roleAccess = this.roleAccess.roleAccess.roleDetails;
    //     const moduleAccess = this.roleAccess.find((module: any) => module.moduleName === accKey);
        
    //     if (!moduleAccess) {
    //       return false; // Deny access if no module access
    //     }
    //     console.log(moduleAccess.accessType[action]);
        
    //     return moduleAccess.accessType[action] === true; // Check if action is allowed
    //   }),
    //   catchError(error => {
    //     console.error('Error checking access:', error);
    //     return of(false);  // In case of an error, deny access
    //   })
    // );

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
