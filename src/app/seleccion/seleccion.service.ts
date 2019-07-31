import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import * as X2JS from 'x2js';
import 'rxjs/add/operator/timeout';


@Injectable({
  providedIn: 'root'
})
export class SeleccionService {

  constructor(private http: HttpClient) { }


  obtenerCentro(codCentro: string): Observable<any> {
    // let url = 'http://mar3prdd22.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_get_posiciones_entrada/100/zwd_get_posiciones_entrada/zwd_get_posiciones_entrada';
    let url = 'http://localhost:8088/mockZCO_PDA_ENTRADA'
    let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
 <soapenv:Header/>
 <soapenv:Body>
    <urn:ZWD_MM_DATOS_ARTICULO3>
       <!--Optional:-->
       <IDNLF>?</IDNLF>
       <!--Optional:-->
       <LIFNR>?</LIFNR>
       <!--Optional:-->
       <MATNR>?</MATNR>
       <UM>
          <!--Zero or more repetitions:-->
          <item>
             <MEINH>?</MEINH>
             <MSEH3>?</MSEH3>
             <MSEHT>?</MSEHT>
             <UMREZ>?</UMREZ>
             <UMREN>?</UMREN>
          </item>
       </UM>
       <WERKS>?</WERKS>
    </urn:ZWD_MM_DATOS_ARTICULO3>
 </soapenv:Body>
</soapenv:Envelope>
      `;

    return this.http.post(url, body, { responseType: 'text' })
       .map(data => {
          //console.log(data);
          var datosArticulo;
          var codError;
          //let x2js = require('x2js');
          let x2js = new X2JS();
          let dom = x2js.xml2dom(data);

          let mensajeError = dom.getElementsByTagName("ERROR")[0].innerHTML;
          if (mensajeError != null && !(mensajeError.length == 0))
             codError = 4;
          else
             codError = 0;

          let codigo = dom.getElementsByTagName("MATNR")[0].innerHTML;
          let descripcion = dom.getElementsByTagName("MAKTX")[0].innerHTML;
          let caja = dom.getElementsByTagName("CAJA")[0].innerHTML;
          let retractil = dom.getElementsByTagName("RETRACTIL")[0].innerHTML;
          let manto = dom.getElementsByTagName("MANTO")[0].innerHTML;
          let palet = dom.getElementsByTagName("PALET")[0].innerHTML;

        /*   datosArticulo = new DatosArticulo(
             codigo,
             descripcion,
             +caja,
             +retractil,
             +manto,
             +palet,
             codError,
             mensajeError,

          );

          this.datosArticulos.push(datosArticulo); */
          return "hola";
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
