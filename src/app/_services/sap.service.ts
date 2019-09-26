import { Injectable } from '@angular/core';
import { Observable , of as observableOf , throwError  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

import { LoginViewModel } from '../_entities/LoginViewModel';
import * as X2JS from 'x2js';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { environment } from '../../environments/environment';
import { DateAdapter } from '@angular/material/core';
import { ElementSchemaRegistry } from '@angular/compiler';
import { md5 } from './md5';
//import * as jsencrypt from 'jsencrypt';

@Injectable()
export class SapService {

  isLoggedIn = false;
  mensaje: string;

  redirectUrl: string;
  appId: string;

  constructor(private http: HttpClient) {
    this.appId = "mKHeWWE92W6w"
  }

  pad(key: string, size: number): string {
    let s = key + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  public md5(token:string): string {
    let sum: number = token.split('').reduce((s: number, digit: string) => s + parseInt(digit), 0);
    let generatedKey: string = this.appId;
    while (sum--) {
      generatedKey = <string>md5(generatedKey);
      generatedKey = this.pad(generatedKey, 32);
    }
    return generatedKey
  }



  login(login: LoginViewModel): Observable<boolean> {

    console.log('user='+login.user );
    console.log('password='+login.password );

    let url = environment.serviceUrl + 'sap/bc/srt/rfc/sap/zmm_pda/' + environment.serviceCode + '/zmm_pda/zmm_pda';
    let body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
          <urn:ZUSR_LOGIN_CHECK>
            <!--Optional:-->
            <BNAME>${login.user}</BNAME>
            <!--Optional:-->
            <PASSWORD>${login.password}</PASSWORD>
            <!--Optional:-->
            <USE_NEW_EXCEPTION></USE_NEW_EXCEPTION>
            <!--Optional:-->
            <XBCODE></XBCODE>
            <!--Optional:-->
            <XCODVN></XCODVN>
          </urn:ZUSR_LOGIN_CHECK>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    return this.http.post(url, body, { responseType: 'text' })
      .map(data => {
        let x2js = new X2JS();
        let dom = x2js.xml2dom(data);

        let msg = dom.getElementsByTagName('MSG')[0].innerHTML;
        this.mensaje = msg;
        let codigo = dom.getElementsByTagName('CODIGO')[0].innerHTML;


        if(Number(codigo) == 0){
          this.isLoggedIn = true;
          return true;
        }
        return false;
      })
      .pipe(
        catchError(this.handleError)
      );
  }


  //login(login: LoginViewModel, encryptedBody: string, apiKey: string): Observable<boolean> {
  /*login(login: LoginViewModel): Observable<boolean> {
    return Observable.of(true).delay(0).do(val => this.isLoggedIn = true);
  }*/
    /*
    const url = environment.authUrl + "public/users/login";
    const body = JSON.stringify({ "login": encryptedBody })
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'APIKEY': apiKey
      })
    };
    return this.http.post(url, body, httpOptions).map(res => {
      this.isLoggedIn = true;
      return res;
    })
    .pipe(
      catchError(this.handleError)
    );
}*/

  logout(): void {
    this.isLoggedIn = false;
  }

  auth(): Observable<any> {
    const url = environment.authUrl + "public/auth";
    return this.http.get(url, {
      responseType: 'text',
      headers: { 'appId': 'prova' },
      observe: 'response'
    }).map(res => {
      return res;
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred client-side:', error.error.message);
    }
    else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    return throwError(
        'Error en la aplicación.'
     );
  }
}
