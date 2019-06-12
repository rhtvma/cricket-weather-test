import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Injectable, Injector} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs'
import {catchError, map, tap, retry} from 'rxjs/operators';

const API_URL = environment.serverBase;

@Injectable()
export class HttpService {
    constructor(private _http: HttpClient) {
    }

    get(url): Observable<any> {
        return this._http.get(API_URL + url, {})
            .pipe(
                map((result: any) => {
                    return result;
                }),
                catchError((error: HttpErrorResponse) => {
                    return Observable.throw(error || 'Internal server error');
                })
            );
    }

    post(url: String, data: any): Observable<any> {
        const apiEndpoint = `${API_URL}${url}`;
        console.log(`Reaching endpoint: ${apiEndpoint}`);
        return this._http.post(apiEndpoint, data, {})
            .pipe(
                map((result: any) => {
                    return result;
                }),
                catchError((error: HttpErrorResponse) => {


                    return Observable.throw(error || 'Internal server error');
                })
            );
    };

    postC(url: String, data: any): Observable<any> {
        const apiEndpoint = `http://localhost:8787${url}`;
        console.log(`Reaching endpoint: ${apiEndpoint}`);
        return this._http.post(apiEndpoint, data, {})
            .pipe(
                map((result: any) => {
                    return result;
                }),
                catchError((error: HttpErrorResponse) => {
                    return Observable.throw(error || 'Internal server error');
                })
            );
    };

    put(url: String, data: any): Observable<any> {
        const apiEndpoint = `${API_URL}${url}`;
        console.log(`Reaching endpoint: ${apiEndpoint}`);
        return this._http.put(apiEndpoint, data, {})
            .pipe(
                map((result: any) => {
                    return result;
                }),
                catchError((error: HttpErrorResponse) => {
                    return Observable.throw(error || 'Internal server error');
                })
            );
    };

    delete(url: String, id: any): Observable<any> {
        const apiEndpoint = `${API_URL}${url}`;
        console.log(`Reaching endpoint: ${apiEndpoint}`);
        return this._http.delete(apiEndpoint + '/' + id)
            .pipe(
                map((result: any) => {
                    return result;
                }),
                catchError((error: HttpErrorResponse) => {
                    return Observable.throw(error || 'Internal server error');
                })
            );
    };
}
