import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import * as X2JS from 'x2js';
import 'rxjs/add/operator/timeout';
import { TiposMov } from '../_entities/TiposMov';
import { TiposRef } from '../_entities/TiposRef';
import { DatosCentro } from '../_entities/DatosCentro';
import { DatosProveedor } from '../_entities/DatosProveedor'; 2
import { DatosArticuloProv } from '../_entities/DatosArticuloProv';
import { DataService } from '../_services/data.service';

@Injectable({
   providedIn: 'root'
})
export class SeleccionService {

   constructor(private http: HttpClient,
      private data: DataService) { }

   public currDatosCentro: DatosCentro;
   public tiposMov: TiposMov[] = [];
   public tiposRef: TiposRef[] = [];
   public codTiposMov: string;

   public currTipoMov: string;
   public currDocumento: string;
   public currTipoDoc: string;
   public currProveedor: string;
   public currNombre: string;
   public currAlbaran: string;
   public currObservaciones: string;
   


   obtenerTiposMov(idProceso: string): Observable<any> {
      let url = 'http://gmr3qas.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/100/zwd_cabecera_entrada/zwd_cabecera_entrada';
      //let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
      let body = `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZWD_MM_MATCH_TIPOMOV>
         <!--Optional:-->
         <I_LIST></I_LIST>
         <!--Optional:-->
         <I_REMOVE_PLATAFORMA></I_REMOVE_PLATAFORMA>
         <I_TIPOMOV>
            <TIPPRO>001</TIPPRO>
            <TIPMOV></TIPMOV>
            <BWART></BWART>
            <COMPRA></COMPRA>
            <BSART></BSART>
            <TIPREF></TIPREF>
            <DES_TIPOMOV></DES_TIPOMOV>
            <EXCLIST></EXCLIST>
         </I_TIPOMOV>
         <TO_FOUND_DOC>
            <!--Zero or more repetitions:-->
            <item>
               <TIPMOV></TIPMOV>
               <TIPO_DOC_REFER></TIPO_DOC_REFER>
               <TXT_TIPO_DOC_REF></TXT_TIPO_DOC_REF>
            </item>
         </TO_FOUND_DOC>
         <TO_FOUND_MOV>
            <!--Zero or more repetitions:-->
            <item>
               <TIPPRO></TIPPRO>
               <TIPMOV></TIPMOV>
               <BWART></BWART>
               <COMPRA></COMPRA>
               <BSART></BSART>
               <TIPREF></TIPREF>
               <DES_TIPOMOV></DES_TIPOMOV>
               <EXCLIST></EXCLIST>
            </item>
         </TO_FOUND_MOV>
         <!--Optional:-->
         <TO_RETURN>
            <!--Zero or more repetitions:-->
            <item>
               <TYPE></TYPE>
               <ID></ID>
               <NUMBER></NUMBER>
               <MESSAGE></MESSAGE>
               <LOG_NO></LOG_NO>
               <LOG_MSG_NO></LOG_MSG_NO>
               <MESSAGE_V1></MESSAGE_V1>
               <MESSAGE_V2></MESSAGE_V2>
               <MESSAGE_V3></MESSAGE_V3>
               <MESSAGE_V4></MESSAGE_V4>
               <PARAMETER></PARAMETER>
               <ROW></ROW>
               <FIELD></FIELD>
               <SYSTEM></SYSTEM>
            </item>
         </TO_RETURN>
      </urn:ZWD_MM_MATCH_TIPOMOV>
   </soapenv:Body>
</soapenv:Envelope>
   `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {

            // let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            // obtener tipos  movimiento
            let itemsDOM = Array.from(dom.getElementsByTagName('TO_FOUND_MOV')[0].children);


            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);

               if ((detalle[1].innerHTML !== '') && (detalle[1].innerHTML !== '0')) {

                  this.tiposMov.push(new TiposMov(
                     detalle[0].innerHTML,
                     detalle[1].innerHTML,
                     detalle[6].innerHTML,
                     detalle[2].innerHTML,
                     detalle[3].innerHTML,
                     detalle[4].innerHTML,
                     detalle[5].innerHTML,
                     detalle[7].innerHTML
                  ));
               }
            });

            // obtener tipos  referencia para cada tipo movimiento
            let itemsDOM3 = Array.from(dom.getElementsByTagName('TO_FOUND_DOC')[0].children);


            itemsDOM3.forEach(item => {
               let detalle3 = Array.from(item.children);

               if ((detalle3[1].innerHTML !== '') && (detalle3[1].innerHTML !== '0')) {

                  this.tiposRef.push(new TiposRef(
                     detalle3[0].innerHTML,
                     detalle3[1].innerHTML,
                     detalle3[2].innerHTML
                  ));
               }
            });

            //console.log( JSON.stringify(this.tiposRef));

            let itemsDOM2 = Array.from(dom.getElementsByTagName('TO_RETURN')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);
               this.codTiposMov = detalle2[2].innerHTML;
            });


            return {
               tiposMov: this.tiposMov,
               tiposRef: this.tiposRef,
               codigo: this.codTiposMov,
            };
         })
         .pipe(
            catchError(this.handleError)
         );
   }




   obtenerCentro(codCentro: string): Observable<any> {
      let url = 'http://gmr3qas.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/100/zwd_cabecera_entrada/zwd_cabecera_entrada';
      //let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
      let body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:Z_GET_WERKS>
          <!--Optional:-->
          <I_WERKS></I_WERKS>
          <!--Optional:-->
          <TO_RETURN>
             <!--Zero or more repetitions:-->
             <item>
                <TYPE></TYPE>
                <ID></ID>
                <NUMBER></NUMBER>
                <MESSAGE></MESSAGE>
                <LOG_NO></LOG_NO>
                <LOG_MSG_NO></LOG_MSG_NO>
                <MESSAGE_V1></MESSAGE_V1>
                <MESSAGE_V2></MESSAGE_V2>
                <MESSAGE_V3></MESSAGE_V3>
                <MESSAGE_V4></MESSAGE_V4>
                <PARAMETER></PARAMETER>
                <ROW></ROW>
                <FIELD></FIELD>
                <SYSTEM></SYSTEM>
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

            //console.log("codigo=" + codigo);
            //console.log("nombre=" + nombre);
            //console.log("codError=" + codError);

            if (sinCentro === 'X') {
               mensajeError = "Usuario sin centro asignado";
            }


            datosCentro = new DatosCentro(
               codigo,
               nombre,
               canal,
               +codError,
               mensajeError
            );

            this.currDatosCentro = datosCentro;

            // console.log("datoscentro=" + JSON.stringify(datosCentro));

            return datosCentro;
         })
         .pipe(
            catchError(this.handleError)
         );
   }

   obtenerProveedor(proveedor: string, codCentro: string): Observable<any> {
       let url = 'http://gmr3qas.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/100/zwd_cabecera_entrada/zwd_cabecera_entrada';
      //let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:ZWD_MM_MATCH_CODE_PROV>
            <I_CENTRO>` + codCentro + `</I_CENTRO>
            <I_PARAM>
               <VENDOR>` + proveedor + `</VENDOR>
               <NAME></NAME>
               <NAME_2></NAME_2>
               <CITY></CITY>
               <DISTRICT></DISTRICT>
               <PO_BOX></PO_BOX>
               <POBX_PCD></POBX_PCD>
               <POSTL_CODE></POSTL_CODE>
               <REGION></REGION>
               <STREET></STREET>
               <COUNTRY></COUNTRY>
               <TELEPHONE></TELEPHONE>
               <NIF></NIF>
               <FAX></FAX>
               <REPRESENTANTE></REPRESENTANTE>
               <MEDIO_ENV_PED></MEDIO_ENV_PED>
               <PROV_BLOQUEADO></PROV_BLOQUEADO>
               <INTERNET></INTERNET>
               <SUMINISTRA_CENTRO></SUMINISTRA_CENTRO>
               <COD_REGION></COD_REGION>
               <COD_COUNTRY></COD_COUNTRY>
               <MATERIAL></MATERIAL>
               <SUMINISTRA_PLAT></SUMINISTRA_PLAT>
               <PRIORIDAD></PRIORIDAD>
               <KTOKK></KTOKK>
               <NETPR></NETPR>
            </I_PARAM>
            <!--Optional:-->
            <I_VER_ASIGN_CENTRO></I_VER_ASIGN_CENTRO>
            <T_LFA1>
               <!--Zero or more repetitions:-->
               <item>
                  <VENDOR></VENDOR>
                  <NAME></NAME>
                  <NAME_2></NAME_2>
                  <CITY></CITY>
                  <DISTRICT></DISTRICT>
                  <PO_BOX></PO_BOX>
                  <POBX_PCD></POBX_PCD>
                  <POSTL_CODE></POSTL_CODE>
                  <REGION></REGION>
                  <STREET></STREET>
                  <COUNTRY></COUNTRY>
                  <TELEPHONE></TELEPHONE>
                  <NIF></NIF>
                  <FAX></FAX>
                  <REPRESENTANTE></REPRESENTANTE>
                  <MEDIO_ENV_PED></MEDIO_ENV_PED>
                  <PROV_BLOQUEADO></PROV_BLOQUEADO>
                  <INTERNET></INTERNET>
                  <SUMINISTRA_CENTRO></SUMINISTRA_CENTRO>
                  <COD_REGION></COD_REGION>
                  <COD_COUNTRY></COD_COUNTRY>
                  <MATERIAL></MATERIAL>
                  <SUMINISTRA_PLAT></SUMINISTRA_PLAT>
                  <PRIORIDAD></PRIORIDAD>
                  <KTOKK></KTOKK>
                  <NETPR></NETPR>
               </item>
            </T_LFA1>
            <T_RETURN>
               <!--Zero or more repetitions:-->
               <item>
                  <TYPE></TYPE>
                  <ID></ID>
                  <NUMBER></NUMBER>
                  <MESSAGE></MESSAGE>
                  <LOG_NO></LOG_NO>
                  <LOG_MSG_NO></LOG_MSG_NO>
                  <MESSAGE_V1></MESSAGE_V1>
                  <MESSAGE_V2></MESSAGE_V2>
                  <MESSAGE_V3></MESSAGE_V3>
                  <MESSAGE_V4></MESSAGE_V4>
                  <PARAMETER></PARAMETER>
                  <ROW></ROW>
                  <FIELD></FIELD>
                  <SYSTEM></SYSTEM>
               </item>
            </T_RETURN>
         </urn:ZWD_MM_MATCH_CODE_PROV>
      </soapenv:Body>
   </soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
            //console.log(data);
            var datosProv;
            var mensajeError;
            var codError;


            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            /* if (mensajeError != null && !(mensajeError.length == 0))
               codError = 4;
            else
               codError = 0; */

            let codigo = dom.getElementsByTagName("VENDOR")[0].innerHTML;
            let nombre = dom.getElementsByTagName("NAME")[0].innerHTML;


            if (nombre != null && !(nombre.length == 0)) {
               codError = 0;
               this.data.changeMessage(codigo + ';' + nombre);
            } else {
               codError = 4;
               mensajeError =
                  'No se encontraron registros para la búsqueda seleccionada de proveedores';
            }


            datosProv = new DatosProveedor(
               codigo,
               nombre,
               +codError,
               mensajeError
            );

            console.log(JSON.stringify(datosProv));

            this.currNombre = nombre;

            return datosProv;
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
