import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  delete:string=environment.staffServiceUrl+'/staff/deleteStaff/666fe548e419feb9c05e422d'
  staffUrl:string=environment.staffServiceUrl+"/staff/getStaffDetails"

  constructor(private http:HttpClient) { }

  getstaffAll(){
    return this.http.get(this.staffUrl)
  }

  getstaffById(id: string){
    let url = `${environment.staffServiceUrl}/staff/getStaffById/${id}`;
    return this.http.get(url)
  }

  savestaffDetails(body: any, id?: string): Observable<any>{
    let savesubscribeUrl: string = `${environment.staffServiceUrl}/staff/addStaff`
    if(id){
      savesubscribeUrl = `${savesubscribeUrl}/${id}`;
    }
    return this.http.post(savesubscribeUrl, body)
  }

}

