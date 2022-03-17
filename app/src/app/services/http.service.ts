import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';
import { SnackService } from './snack.service';
import { Board } from '../interfaces/grid';

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
            this._API_URL = api_url.endsWith('/') ? api_url : `${api_url}/`;
        }

    private defaultApiUrl(baseHref: string){
        const _baseHref = baseHref.replace(new RegExp("/","g"),"");
        const location_base = `${window.location.protocol}//${window.location.host}/${_baseHref}`;
        return `${location_base}-api/`;
    }

    public solveGrid(board: Board){
        let url = `${this.API_URL}/solve`;
        return this.getPipe(this.http.post<Board>(url,board), url, 'solveGrid');
    }

    protected getPipe<T>(obs: Observable<T | HttpErrorResponse>, url: string, message: string, noLoader?: string | true): Observable<T | HttpErrorResponse> {
		if (noLoader != true)
            this.loadingService.inc(noLoader);
        return obs.pipe(
            tap(() => {
                if (noLoader != true)
                    this.loadingService.dec(noLoader);
            }),
            catchError(this.handleError(url+' => '+message))
        );
	}

	protected handleError (operation = 'operation') {
        return (httpError: HttpErrorResponse): Observable<HttpErrorResponse> => {
            var errorMessage: string = (httpError.error && typeof httpError.error.message == 'string') ? httpError.error.message : ""+httpError.message;
            errorMessage = `(${httpError.status}) ${errorMessage}`;
            this.loadingService.dec();
            this.snackService.showSnack(errorMessage);
            this.logger.error(`HANDLE ERROR [${operation}]`);
            this.logger.error(httpError);
            return of(httpError as HttpErrorResponse);
        };
    }
}
