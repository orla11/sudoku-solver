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

  public getStoredObj<T>(key: string, group?: string) :T | undefined{
    if (!key) return;
    
    const storedElem = this.getItem(key, group);
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

  public getExpiringTime(key: string, group?: string) :number | undefined {
    if (!key) return;

    const storedElem = this.getItem(key, group);
    if (storedElem)
      return storedElem.expireTime;

    return;
  }

  public removeStoredObj(key: string, group?: string){
    if (!key) return;

    const compositeKey = this.getCompositeKey(key, group);
    localStorage.removeItem(compositeKey);
  }

  public setStoredObjWithGroup(group: string, key: string, obj: any, expiringTime?: number){
    this._setStoredObj(key, obj, expiringTime, group);
  }

  public setStoredObj(key: string, obj: any, expiringTime?: number){
    this._setStoredObj(key, obj, expiringTime);
  }

  private _setStoredObj(key: string, obj: any, expiringTime?: number, group?: string){
    if (!key) return;

    const compositeKey = this.getCompositeKey(key, group);
    const expiringElem: ExpiringStorageElement = {
      expireDate: (expiringTime) ? new Date(expiringTime) : undefined,
      expireTime: expiringTime,
      obj: obj
    }
    localStorage.setItem(compositeKey, JSON.stringify(expiringElem));
  }

  private getCompositeKey(key: string, group?: string){
    return (group) ? group+'_'+key : key;
  }

  private getItem(key: string, group?: string): ExpiringStorageElement | undefined {
    const compositeKey = this.getCompositeKey(key, group);
    const item = localStorage.getItem(compositeKey);
    if (item)
      return JSON.parse(item);
    
    return;
  }

}
