import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  paymentUrl:string=environment.paymentServiceUrl+"/payment"

  constructor(private http:HttpClient) { }

getPaymentAll(){
  return this.http.get(`${this.paymentUrl}/getPaymentDetails`)
}

getCollectionAll(){
  return this.http.get(`${this.paymentUrl}/getCollectionDetails`)
}

getTransactionAll(){
  return this.http.get(`${this.paymentUrl}/getTransactionDetails`)
}

getPaymentById(id: string){
  let url = `${this.paymentUrl}/getPaymentById/${id}`;
  return this.http.get(url)
  console.log(url);
  
}

getCollectionById(id: string){
  let url = `${this.paymentUrl}/getCollectionById/${id}`;
  return this.http.get(url)
}

getTransactionById(id: string){
  let url = `${this.paymentUrl}/getTransactionById/${id}`;
  return this.http.get(url)
}

savePaymentDetails(body: any, id?: string): Observable<any>{
  let savepaymentUrl: string = `${this.paymentUrl}/addPayment`
  if(id){
    savepaymentUrl = `${savepaymentUrl}/${id}`;
  }
  return this.http.post(savepaymentUrl, body)
}

saveCollectionDetails(body: any, id?: string): Observable<any>{
  let savecollectiontUrl: string = `${this.paymentUrl}/addCollection`
  if(id){
    savecollectiontUrl = `${savecollectiontUrl}/${id}`;
  }
  return this.http.post(savecollectiontUrl, body)
}

saveTransactionDetails(body: any, id?: string): Observable<any>{
  let savetransactionUrl: string = `${this.paymentUrl}/addTransaction`
  if(id){
    savetransactionUrl = `${savetransactionUrl}/${id}`;
  }
  return this.http.post(savetransactionUrl, body)
}

deletePayment(id:string){
  let url:string= `${this.paymentUrl}/deletePayment/${id}`
  return this.http.delete(url)
}



}


