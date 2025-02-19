import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  
  saveChitDetails(chitDetails: any,id?: string): Observable<any> {
    let url = `${environment.chitServiceUrl}/chitgroup/addchitGroup`;
    if(id){
      url = `${url}/${id}`;
    }
    return this.http.post<any>(url, chitDetails);
  }

  
  getChitById(id: string){
    let url = `${environment.chitServiceUrl}/chitgroup/getChitGroupById/${id}`;
    return this.http.get(url)
  }

  getAuctionToday(){
    let url = `${environment.chitServiceUrl}/chitgroup/getByAucDate`;
    return this.http.get(url)
  }
  
  getByPassbooNo(passbooknumber:string){
    let url:string= `${environment.chitServiceUrl}/chitgroup/getByPassbookNo/${passbooknumber}`
    return this.http.get(url)
  }

  getSubscriberByTicketId(passbookNumber: string, groupId: string): Observable<any> {
    let url:string = `${environment.chitServiceUrl}/chitgroup/getByTicketId/${groupId}/${passbookNumber}`
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

  getLastCreatedAuction(groupId: string): Observable<any>{
    let url:string = `${environment.auctionServiceUrl}/chit_management/getLastCreatedAuction/${groupId}`
    return this.http.get(url)
  }
  
  getTicketById(id:string,groupId:string){
    let url: string = `${environment.chitServiceUrl}/getByTicketId/${groupId}/${id}`
    return this.http.get(url)
  }

  findTicketInGroup(groupId:string,passbookNumber:number):Observable<any>{
    let url:string = `${environment.auctionServiceUrl}/chit_management/findTicketInGroup/${groupId}/${passbookNumber}`
    return this.http.get(url)
  } 

  getTicketId(groupId:any):Observable<any>{    
    let url:string= `${environment.auctionServiceUrl}/chit_management/getTicketId/${groupId}`
    return this.http.get(url)
  }
  getAuctionById(id:any):Observable<any> {
      let url:string= `${environment.auctionServiceUrl}/chit_management/getChitbyId/${id}`
  
      return this.http.get(url);
    }

    getSubAuction(passbooknumber:any):Observable<any> {
      let url:string= `${environment.auctionServiceUrl}/chit_management/getSubAuction/${passbooknumber}`
  
      return this.http.get(url);
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

  updateSubscriber(chitGroupId: string, passbookNo: string, updatedData: any): Observable<any> {
    const url = `${environment.chitServiceUrl}/chitgroup/updateSubscriber/${chitGroupId}/${passbookNo}`;

    // Perform the HTTP PUT request
    return this.http.put(url, updatedData);
  }

  addSubscriber(chitGroupId: string, updatedData: any): Observable<any> {
    const url = `${environment.chitServiceUrl}/chitgroup/addSubscriber/${chitGroupId}`;

    // Perform the HTTP PUT request
    return this.http.post(url, updatedData);
  }

  deleteAuction(id:any): Observable<any> {
    const url = `${environment.chitServiceUrl}/chit_management/deleteAuction/${id}`;

    // Perform the HTTP PUT request
    return this.http.delete(url);
  }

  getAllAuction(){

    let url=`${this.auctionUrl}/chit_management/get_all_chit`
    return this.http.get(url)
  }

  getAuctionCompleted(){
    let url=`${this.auctionUrl}/chit_management/dashboardData`
    return this.http.get(url)
  }
}

