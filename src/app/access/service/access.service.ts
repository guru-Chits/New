import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http:HttpClient) { }

accessUrl:string=environment.accessServiceUrl+"/access/"
getAccessByRole(role:string){
  return this.http.get(`${this.accessUrl}/getRoleDetails/${role}`)
}
}
