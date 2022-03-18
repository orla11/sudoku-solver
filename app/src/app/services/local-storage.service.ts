import { Injectable } from '@angular/core';

interface ExpiringStorageElement{
  expireDate?: Date,
  expireTime?: number,
  obj: any
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getStoredObj<T>(group: string, key: string) :T | undefined{
    if (!key) return;
    
    const storedElem = this.getItem(group, key);
    if (
        storedElem
        && 
        (!storedElem.expireTime || (storedElem.expireTime && new Date().getTime() <= storedElem.expireTime)) 
        && 
        storedElem.obj
      ){
      return storedElem.obj as T;
    }

    return;
  }

  public getExpiringTime(group: string, key: string) :number | undefined {
    if (!key) return;

    const storedElem = this.getItem(group, key);
    if (storedElem)
      return storedElem.expireTime;

    return;
  }

  public removeStoredObj(group: string, key: string){
    if (!key) return;
    let compositeKey = (group) ? group+'_'+key : key;
    localStorage.removeItem(compositeKey);
  }

  public setStoredObj(group: string, key: string, obj: any, expiringTime?: number){
    if (!key) return;
    let compositeKey = (group) ? group+'_'+key : key;
    let expiringElem: ExpiringStorageElement = {
      expireDate: (expiringTime) ? new Date(expiringTime) : undefined,
      expireTime: expiringTime,
      obj: obj
    }
    localStorage.setItem(compositeKey, JSON.stringify(expiringElem));
  }

  private getItem(group: string, key: string): ExpiringStorageElement | undefined {
    const compositeKey = (group) ? group+'_'+key : key;
    const item = localStorage.getItem(compositeKey);
    if (item)
      return JSON.parse(item);
    
    return;
  }

}
