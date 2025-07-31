import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  paymentUrl:string=environment.paymentServiceUrl+"/payment"

  constructor(private http:HttpClient) { 
    
  }

getPaymentAll(){
  return this.http.get(`${this.paymentUrl}/getPaymentDetails`)
}

getByGroupId(groupId: string){
  let url = `${this.paymentUrl}/getByGroupId/${groupId}`; 
  return this.http.get(url);
}

getCollectionAll(){
  return this.http.get(`${this.paymentUrl}/getCollectionDetails`)
}

getTodayPayment(){
  return this.http.get(`${this.paymentUrl}/getTodayPayment`)

}
getTransactionAll(){
  return this.http.get(`${this.paymentUrl}/getTransactionDetails`)
}

getPaymentById(id: string){
  let url = `${this.paymentUrl}/getPaymentById/${id}`;
  return this.http.get(url)
}

getAmountByRouteId(routeId:string){
  let url=`${this.paymentUrl}/getByRoute/${routeId}`
  return this.http.get(url)
}

getRouteByDate(fromDate: any, toDate?: any): Observable<any> {
  let params = new HttpParams().set('fromDate', fromDate);
  
  // If toDate is provided, add it to the params
  if (toDate) {
    params = params.set('toDate', toDate);
  }

  return this.http.get(`${this.paymentUrl}/getRouteByDate`, { params });
}
getRouteVerfiedByDate(fromDate: any, toDate?: any): Observable<any> {
  let params = new HttpParams().set('fromDate', fromDate);
  
  // If toDate is provided, add it to the params
  if (toDate) {
    params = params.set('toDate', toDate);
  }

  return this.http.get(`${this.paymentUrl}/getRouteVerfiedByDate`, { params });
}

getTotal(date:Date,routeId:string,selectStaff:any){
  let url=`${this.paymentUrl}/getTotalAmount/${date}/${routeId}/${selectStaff}`
  return this.http.get(url)
}
getStaff(date:Date,routeId:string){
  let url=`${this.paymentUrl}/getStaffs/${date}/${routeId}`
  return this.http.get(url)

}

getGrandTotal(date: string, region?: string): Observable<any> {
  let url = `${this.paymentUrl}/grandTotal/${date}`;
  
  if (region) {
    url += `/${region}`;  // Append region if provided
  }

  return this.http.get(url);
}


getPaymentByPassbook(passbookNo:string){
  let url=`${this.paymentUrl}/getPaymentByPassbook/${passbookNo}`
  return this.http.get(url)

}
getVerifiedPaymentByPassbook(passbookNo:string){
  let url=`${this.paymentUrl}/getVerifiedPaymentByPassbook/${passbookNo}`
  return this.http.get(url)

}
getDataByDate(fromDate: any, toDate:any,region?: string , collectionType?:string){
  let url=`${this.paymentUrl}/getDataByDate/${fromDate}/${toDate}`
  if(region&&!collectionType){
    url+=`/${region}`;
  }
  return this.http.get(url);
}

getDataByCollection(fromDate: any, toDate:any,region?: string , collectionType?:string){
  let url=`${this.paymentUrl}/getDataByCollection/${fromDate}/${toDate}/${region}/${collectionType}`
  // if(region&&!collectionType){
  //   url+=`/${region}`;
  // }
  return this.http.get(url);
}

getTotalByGroupId(insMonth:string,groupId?:string,passbooknumber?:string,lastInstallment?:String): Observable<any> {
  let url=`${this.paymentUrl}/getTotalByGroupId/${insMonth}/${groupId}/${passbooknumber}/${lastInstallment}`
  return this.http.get(url)
}

getAmountByMonth(passbooknumber:string,installmentMonth:any): Observable<any> {
  let url=`${this.paymentUrl}/getAmountByMonth/${passbooknumber}/${installmentMonth}`
  return this.http.get(url)

}


getPassbookNo(date:Date,routeId:string,selectStaff:string){
  let url=`${this.paymentUrl}/getPassbookNo/${date}/${routeId}/${selectStaff}`
  return this.http.get(url)
}
getCollectionById(id: string){
  let url = `${this.paymentUrl}/getCollectionById/${id}`;
  return this.http.get(url)
}

getTransactionById(id: string){
  let url = `${this.paymentUrl}/getTransactionById/${id}`;
  return this.http.get(url)
}

getAddWallet(id: string){
  let url = `${this.paymentUrl}/getAddWall/${id}`;
  return this.http.get(url)
}

verifyPassbookNo(passbookno: string): Observable<any> {
  return this.http.get(`${this.paymentUrl}/verifyPassbookNo/${passbookno}`);
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

saveTransactionDetails( groupId: string,
  walletBalance: number,futureDate?: Date
  ): Observable<any>{

    const body: any = { groupId,walletBalance ,futureDate};
    
  let savetransactionUrl: string = `${this.paymentUrl}/addTransaction`

  return this.http.post(savetransactionUrl, body)
}

addWallet( groupId: string,
  addWalletBalance: number,
  ): Observable<any>{

    const body: any = { groupId,addWalletBalance };
    
  let savetransactionUrl: string = `${this.paymentUrl}/addWallet`

  return this.http.post(savetransactionUrl, body)
}


deletePayment(id:string){
  let url:string= `${this.paymentUrl}/deletePayment/${id}`
  return this.http.delete(url)
}

getAllTransaction(){
  let url:string=`${this.paymentUrl}/getTransactionDetails`
  return this.http.get(url)
}

getPaymentByDate(date?: Date, routeId?: string): Observable<any> {
  // Ensure that date is properly formatted as a string (YYYY-MM-DD)
  const formattedDate = date ? date.toISOString().split('T')[0] : '';
  // Construct the URL with query parameters
  let url = `${this.paymentUrl}/paymentByDate?date=${formattedDate}`;
  
  // Add the routeId if it is provided
  if (routeId) {
    url += `&routeId=${routeId}`;
  }

  return this.http.get<any>(url);
}


getPaymentByYear(){
  let url:string = `${this.paymentUrl}/payment_year`
  return this.http.get(url)
}

getPaymentByMonth(){
  let url:string = `${this.paymentUrl}/total_trans `
  return this.http.get(url)
}

}


