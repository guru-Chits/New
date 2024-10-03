import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
collectionUrl:string=environment.settingsServiceUrl
  constructor(private httpClient:HttpClient) {}

  collectionSave(body:any,id?:string){
    let saveCollectionUrl:string=`${this.collectionUrl}/collectionAdd`
    if(id){      
      saveCollectionUrl=`${saveCollectionUrl}/${id}`
     }
  return this.httpClient.post(saveCollectionUrl,body)
  }

  getAllCollection(){
    const getUrl=`${this.collectionUrl}/collectionView`
    return this.httpClient.get(getUrl)
  }
   deleteCollection(id:string){
     const deleteUrl=`${this.collectionUrl}/collectionDelete/${id}`
      return this.httpClient.delete(deleteUrl)
    }
    getCollectionById(id:string){
      const getUrl=`${this.collectionUrl}/collectionById/${id}`
      return this.httpClient.get(getUrl)
    }

    reasonAdd(body:any,id?:string){
      let saveReasonUrl:string =`${this.collectionUrl}/deleteReasonAdd`
      if(id){
        saveReasonUrl=`${saveReasonUrl}/${id}`
      }
      return this.httpClient.post(saveReasonUrl,body)
    }
    getAllReason(){
      const getUrl=`${this.collectionUrl}/deleteReasonView`
      return this.httpClient.get(getUrl)
    }
    deleteReason(id:string){
      const deleteUrl=`${this.collectionUrl}/deleteReason/${id}`
       return this.httpClient.delete(deleteUrl)
     }
     getreasonById(id:string){
      const getUrl=`${this.collectionUrl}/reasonById/${id}`
      return this.httpClient.get(getUrl)
    }
}