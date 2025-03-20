import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  delete:string=environment.subscriberServiceUrl+'/subscriber/deleteSubscriber/666fe548e419feb9c05e422d'
  subscriberUrl:string=environment.subscriberServiceUrl+"/subscriber/getSubscriberDetails"
 
  constructor(private http:HttpClient) { }

  getsubscriberAll(){
    return this.http.get(this.subscriberUrl)
  }

  getsubscriberById(id: string){
    let url = `${environment.subscriberServiceUrl}/subscriber/getSubscriberById/${id}`;
    return this.http.get(url)
  }

  getChitGroupById(subscriberId: string){
    let url = `${environment.subscriberServiceUrl}/chitgroup/getBySubscriberId/${subscriberId}`;
    return this.http.get(url)
  }
  getAllChit(){
    let url = `${environment.subscriberServiceUrl}/chitgroup/getAllChitGroup`;
    return this.http.get(url)
  }

  savesubscriberDetails(body: any, id?: string): Observable<any>{
    let savesubscribeUrl: string = `${environment.subscriberServiceUrl}/subscriber/addSubscriber`
    if(id){
      savesubscribeUrl = `${savesubscribeUrl}/${id}`;
    }
    return this.http.post(savesubscribeUrl, body)
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<{ url: string }>('/api/upload', formData).pipe(
      map(response => response.url)
    );
  }



}

//https://chitfundapi.onrender.com/api/subscriber/getSubscriberById/66aa7f98ad1dcb4265bb9275
