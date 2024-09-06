import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChitService {
  chitUrl:string=environment.chitServiceUrl+"/chitgroup/getAllChitGroup"
  constructor(private http: HttpClient) { }

  getAllChit(){
    return this.http.get(this.chitUrl)
  }

  saveChitDetails(chitDetails: any): Observable<any> {
    const url = `${environment.subscriberServiceUrl}/chitgroup/addchitGroup`;
    return this.http.post<any>(url, chitDetails);
  }

  
  getChitById(id: string){
    let url = `${environment.chitServiceUrl}/chitgroup/getChitGroupById/${id}`;
    return this.http.get(url)
  }

  getByPassbooNo(passbooknumber:string){
    let url:string= `${environment.chitServiceUrl}/chitgroup/getByPassbookNo/${passbooknumber}`
    return this.http.get(url)
  }

  getSubscriberByTicketId(ticketId: string, groupId: string): Observable<any> {
    let url:string = `${environment.chitServiceUrl}/getSubscriberDetails/${ticketId}/${groupId}`
    return this.http.get(url)
  }
}
