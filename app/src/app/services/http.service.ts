import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';
import { SnackService } from './snack.service';
import { Board } from '../interfaces/grid';

export interface HttpRequestConfig{
    noLoader?: string | true
    noSnackbar?: boolean
    noError?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

    private _API_URL;
	public get API_URL() : string {
		return this._API_URL;
	}
    
    constructor(private http: HttpClient, private logger: LoggerService, 
        private loadingService: LoadingService, private snackService: SnackService, @Inject(APP_BASE_HREF) public baseHref: string){ 
            const api_url = environment.apiEndpoint || this.defaultApiUrl(baseHref);
            this._API_URL = api_url.endsWith('/') ? api_url.substring(0, api_url.length - 2) : api_url;
        }

    private defaultApiUrl(baseHref: string){
        const _baseHref = baseHref.replace(new RegExp("/","g"),"");
        const location_base = `${window.location.protocol}//${window.location.host}/${_baseHref}`;
        return `${location_base}-api/`;
    }

    public solveGrid(board: Board){
        let url = `${this.API_URL}/solve`;
        return this.getPipe(this.http.post<Board>(url,board), url, 'solveGrid', {noError: true});
    }

    protected getPipe<T>(obs: Observable<T>, url: string, message: string, config?: HttpRequestConfig): Observable<T> {
		if (config?.noLoader != true)
            this.loadingService.inc(config?.noLoader);

        const _result = obs.pipe(
            tap(() => {
                if (config?.noLoader != true)
                    this.loadingService.dec(config?.noLoader);
            }),
            catchError(this.handleError<T>(`${url} => ${message}`, config))
        );

        let result = _result;
        if (config?.noError)
            result = _result.pipe(
                catchError(()=>of(undefined as unknown as T))
            )
        
        return result;
	}

    protected handleError<T>(operation = 'operation', config?: HttpRequestConfig) {
        return (httpError: HttpErrorResponse): Observable<T> => {
            var errorMessage: string = (httpError.error && typeof httpError.error.message == 'string') ? httpError.error.message : ""+httpError.message;
            errorMessage = `(${httpError.status}) ${errorMessage}`;

            if (config?.noLoader != true)
                this.loadingService.dec(config?.noLoader);
            if (config?.noSnackbar != true)
                this.snackService.showSnack(errorMessage);
            
            this.logger.error(`HANDLE ERROR [${operation}]`);
            this.logger.error(httpError);

            throw httpError;
        };
    }
}
