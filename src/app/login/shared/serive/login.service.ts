import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }
  
loginUrl:string=environment.loginServiceUrl+'/login/'
  getLoginDetail(empId:string){
    return this.http.get(`${this.loginUrl}getloginDetail/${empId}`)
  }
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('userRole');
  }

}
