import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChitService {
  auctionUrl: string = environment.auctionServiceUrl
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
    let url:string = `${environment.chitServiceUrl}/chitgroup/getByTicketId/${groupId}/${ticketId}`
    return this.http.get(url)
  }

  saveAuctionDetails(body: any, id?: string): Observable<any>{
    let saveauctionUrl: string = `${this.auctionUrl}/chit_management/regular_chit`
    if(id){
      saveauctionUrl = `${saveauctionUrl}/${id}`;
    }
    return this.http.post(saveauctionUrl, body);
  }

  getAuctionCycleByGroupId(groupId: string): Observable<any>{
    let url:string = `${environment.auctionServiceUrl}/chit_management/getAuction/${groupId}`
    return this.http.get(url)
  }
  getTicketById(id:string,groupId:string){
    let url: string = `${environment.chitServiceUrl}/getByTicketId/${groupId}/${id}`
    return this.http.get(url)
    console.log(url);
  }

  findTicketInGroup(groupId:string,ticketId:number):Observable<any>{
    let url:string = `${environment.auctionServiceUrl}/chit_management/findTicketInGroup/${groupId}/${ticketId}`
    return this.http.get(url)
  } 

  deleteSubscriber(groupId: string, ticketId: string):Observable<any>{
    let url:string = `${environment.chitServiceUrl}/chitgroup/chit-group/${groupId}/${ticketId}`
    return this.http.delete(url)
  }

  getAllChitAuction(): Observable<any>{
    let url:string = `${environment.chitServiceUrl}/chit_management/get_all_chit`
    return this.http.get(url)
  }

  getChitAuctionById(groupId: string): Observable<any>{
    let url:string = `${environment.chitServiceUrl}/chit_management/getchit/${groupId}`
    return this.http.get(url)
  }
}
