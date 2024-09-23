import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})     
export class AreaService {
 areaUrl:string=environment.areaServiceUrl+"/route/getRouteDetails"
 routeUrl:string=environment.areaServiceUrl+"/route/getRegionDetails"

  constructor(private http:HttpClient) {}

  saverouteDetails(body: any, id?: string): Observable<any>{
    let saverouteUrl: string = `${environment.areaServiceUrl}/route/addRoute`
    if(id){
      saverouteUrl = `${saverouteUrl}/${id}`;
    }
    return this.http.post(saverouteUrl, body)
  }

  getrouteAll(){
    return this.http.get(this.areaUrl)
  }
  getrouteById(id: string){
    let url = `${environment.areaServiceUrl}/route/getRouteById/${id}`;
    return this.http.get(url)
  }


  
  saveregionDetails(body: any, id?: string): Observable<any>{
    let saveregionUrl: string = `${environment.areaServiceUrl}/route/addRegion`
    if(id){
      saveregionUrl = `${saveregionUrl}/${id}`;
    }
    return this.http.post(saveregionUrl, body)
  }
  getregionAll(){
    return this.http.get(this.routeUrl)
  }
  getregionById(id: string){
    let url = `${environment.areaServiceUrl}/route/getRegionById/${id}`;
    return this.http.get(url)
  }
}
