import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  delete: string = environment.staffServiceUrl + '/staff/deleteStaff/666fe548e419feb9c05e422d'
  staffUrl: string = environment.staffServiceUrl + "/staff/getStaffDetails"
  private apiUrl = 'https://2factor.in/API/R1/';
  private apiKey = 'b1037ef1-2ed8-11ef-8b60-0200cd936042'; // Your API key
  private senderId = 'KNGCPL'; // Sender ID
  private templateName = 'Onboarding'; // Template name

  constructor(private http: HttpClient) { }

  getstaffAll() {
    return this.http.get(this.staffUrl)
  }

  getstaffById(id: string) {
    let url = `${environment.staffServiceUrl}/staff/getStaffById/${id}`;
    return this.http.get(url)
  }

  savestaffDetails(body: any, id?: string): Observable<any> {
    let savesubscribeUrl: string = `${environment.staffServiceUrl}/staff/addStaff`
    if (id) {
      savesubscribeUrl = `${savesubscribeUrl}/${id}`;
    }
    return this.http.post(savesubscribeUrl, body)
  }

  sendSms(clientNumber: string, var1: string, var2: string): Observable<any> {
    const url = `${this.apiUrl}?module=TRANS_SMS&apikey=${this.apiKey}&to=${clientNumber}&from=${this.senderId}&templatename=${this.templateName}&var1=${var1}&var2=${var2}`;
    return this.http.get<any>(url);
  }
}



