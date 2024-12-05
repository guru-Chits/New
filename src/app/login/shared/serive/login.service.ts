import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isVerified = false;
  constructor(private http:HttpClient) { }
  
loginUrl:string=environment.loginServiceUrl+'/login/'
  getLoginDetail(empId:string){
    return this.http.get(`${this.loginUrl}getloginDetail/${empId}`)
  }
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('userRole');
  }
  markAsVerified() {

   return this.isVerified = true;

  }

  // Check if the user is verified
  checkVerified(): boolean {    
    return this.isVerified;
  }
  passwordReset(employeeId: string, password: string): Observable<any> {
    const payload = { employeeId, password };
    return this.http.post(`${this.loginUrl}passwordReset`, payload);
  }
}
