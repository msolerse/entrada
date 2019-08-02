import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import * as X2JS from 'x2js';
import 'rxjs/add/operator/timeout';
import { DatosCentro } from '../_entities/DatosCentro';


@Injectable({
  providedIn: 'root'
})
export class SeleccionService {

  constructor(private http: HttpClient) { }


  obtenerCentro(codCentro: string): Observable<any> {
    // let url = 'http://mar3prdd22.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_get_posiciones_entrada/100/zwd_get_posiciones_entrada/zwd_get_posiciones_entrada';
    let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
    let body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:Z_GET_WERKS>
          <!--Optional:-->
          <I_WERKS>?</I_WERKS>
          <!--Optional:-->
          <TO_RETURN>
             <!--Zero or more repetitions:-->
             <item>
                <TYPE>?</TYPE>
                <ID>?</ID>
                <NUMBER>?</NUMBER>
                <MESSAGE>?</MESSAGE>
                <LOG_NO>?</LOG_NO>
                <LOG_MSG_NO>?</LOG_MSG_NO>
                <MESSAGE_V1>?</MESSAGE_V1>
                <MESSAGE_V2>?</MESSAGE_V2>
                <MESSAGE_V3>?</MESSAGE_V3>
                <MESSAGE_V4>?</MESSAGE_V4>
                <PARAMETER>?</PARAMETER>
                <ROW>?</ROW>
                <FIELD>?</FIELD>
                <SYSTEM>?</SYSTEM>
             </item>
          </TO_RETURN>
       </urn:Z_GET_WERKS>
    </soapenv:Body>
 </soapenv:Envelope>
      `;

    return this.http.post(url, body, { responseType: 'text' })
       .map(data => {
          //console.log(data);
          var datosCentro;
          var mensajeError;

        
          //let x2js = require('x2js');
          let x2js = new X2JS();
          let dom = x2js.xml2dom(data);

          let codError = dom.getElementsByTagName("NUMBER")[0].innerHTML;
          /* if (mensajeError != null && !(mensajeError.length == 0))
             codError = 4;
          else
             codError = 0; */

          let sinCentro = dom.getElementsByTagName("SIN_CENTRO")[0].innerHTML;
          let codigo = dom.getElementsByTagName("WERKS")[0].innerHTML;
          let nombre = dom.getElementsByTagName("WERKS_DESC")[0].innerHTML;
          let canal = dom.getElementsByTagName("VTWEG")[0].innerHTML;

          console.log("codigo="+codigo);
          console.log("nombre="+nombre);
          console.log("codError="+codError);

          if (sinCentro === 'X') 
              mensajeError = "Usuario sin centro asignado";

      
           datosCentro = new DatosCentro(
             codigo,
             nombre,
             canal,
             +codError,
             mensajeError
          );

          console.log("datoscentro="+JSON.stringify(datosCentro));
          
          return datosCentro;
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
