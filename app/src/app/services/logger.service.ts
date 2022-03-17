import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  get info() : Function{
    if (!environment.production)
      return console.info.bind(console);
    else 
      return noop;
  }
    
  get warn() {
    if (!environment.production)
      return console.warn.bind(console);
    else
      return noop;
  }
    
  get error() {
    if (!environment.production) 
      return console.error.bind(console);
    else
      return noop;
  }
}
