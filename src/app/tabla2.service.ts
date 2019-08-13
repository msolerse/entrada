import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import * as X2JS from 'x2js';
import { Element } from './Element';
import 'rxjs/add/operator/timeout';
import { DatosArticulo } from './_entities/DatosArticulo';

@Injectable({
   providedIn: 'root'
})
export class Tabla2Service {

   codigo: string;

   constructor(private http: HttpClient) { }

   public currPedido: string;
   public currAlbaran: string;
   public currPosiciones: Element[];
   public datosArticulos: DatosArticulo[] = [];

   obtenerPosiciones(idPedido: string, albaran: string,
      codCentro: string): Observable<any> {
      // let url = 'http://mar3prdd22.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_get_posiciones_entrada/100/zwd_get_posiciones_entrada/zwd_get_posiciones_entrada';
      let url = 'http://localhost:8088/mockZCO_PDA_ENTRADA'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZWD_GET_POSICIONES_ENTRADA>
         <E_CABECERA>
            <CENTRO>0051</CENTRO>
            <DES_CENTRO>?</DES_CENTRO>
            <ALMACEN>?</ALMACEN>
            <FECHA_CONTAB>?</FECHA_CONTAB>
            <CLASE_MOVIMIENTO>?</CLASE_MOVIMIENTO>
            <DES_TIPOMOV>?</DES_TIPOMOV>
            <PROVEEDOR>?</PROVEEDOR>
            <DESC_PROVEEDOR>?</DESC_PROVEEDOR>
            <NOTA_ENTREGA>?</NOTA_ENTREGA>
            <TIPO_DOC_REFER>?</TIPO_DOC_REFER>
            <DES_TIPO_DOC_REF>?</DES_TIPO_DOC_REF>
            <DOCUMENTO_REFER>?</DOCUMENTO_REFER>
            <MOTIVO_PED>?</MOTIVO_PED>
            <MOTIVO_MOV>?</MOTIVO_MOV>
            <DES_MOTIVO_MOV>?</DES_MOTIVO_MOV>
            <OBSERVACIONES>?</OBSERVACIONES>
            <CENTRO_DES>?</CENTRO_DES>
            <DES_CENTRO_DES>?</DES_CENTRO_DES>
            <ALMACEN_DES>?</ALMACEN_DES>
            <DOCUMENTO_MAT>?</DOCUMENTO_MAT>
            <DOCUMENTO_MAT_AUX>?</DOCUMENTO_MAT_AUX>
            <YEAR>?</YEAR>
            <NOMBRE>?</NOMBRE>
            <MATRICULA>?</MATRICULA>
            <DOCUMENTO_REFER_ORIG>?</DOCUMENTO_REFER_ORIG>
            <TIPO_DOC_REFER_ORIG>?</TIPO_DOC_REFER_ORIG>
            <POSITIVO>?</POSITIVO>
            <ES_SIN_CARGO>?</ES_SIN_CARGO>
            <USUARIO>?</USUARIO>
            <MERMA>?</MERMA>
            <ES_ENTREGA_PARC>?</ES_ENTREGA_PARC>
            <DOCUMENTO_REFER_PARENT>?</DOCUMENTO_REFER_PARENT>
            <TIPO_DOC_REFER_PARENT>?</TIPO_DOC_REFER_PARENT>
            <TIPED>?</TIPED>
            <REF_VTA>?</REF_VTA>
            <DOC_REFER_INTERNAL>?</DOC_REFER_INTERNAL>
            <DOCUMENTO_REFER_REAL>?</DOCUMENTO_REFER_REAL>
            <TIPO_DOC_REFER_REAL>?</TIPO_DOC_REFER_REAL>
            <VALORACION>?</VALORACION>
         </E_CABECERA>
         <!--Optional:-->
         <I_VALIDACION_ALT>?</I_VALIDACION_ALT>
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
         <!--Optional:-->
         <T_LOTES>
            <!--Zero or more repetitions:-->
            <item>
               <POSICION>?</POSICION>
               <MATERIAL>?</MATERIAL>
               <CANTIDAD>?</CANTIDAD>
               <LOTE>?</LOTE>
               <UNIDAD>?</UNIDAD>
               <FECHA_CAD>?</FECHA_CAD>
               <FECHA_ENV>?</FECHA_ENV>
               <PESO>?</PESO>
               <UNIDAD_PESO>?</UNIDAD_PESO>
               <LOTES_AUTO>?</LOTES_AUTO>
               <CONV_UN_BASE>?</CONV_UN_BASE>
            </item>
         </T_LOTES>
         <T_POS>
            <!--Zero or more repetitions:-->
            <item>
               <POSICION>?</POSICION>
               <MATERIAL>?</MATERIAL>
               <DESC_MATERIAL>?</DESC_MATERIAL>
               <CANTIDAD>?</CANTIDAD>
               <UNIDAD_MEDIDA>?</UNIDAD_MEDIDA>
               <CANT_SIN_CARGO>?</CANT_SIN_CARGO>
               <LOTE>?</LOTE>
               <CANTIDAD_REFER>?</CANTIDAD_REFER>
               <UN_MEDIDA_ENT>?</UN_MEDIDA_ENT>
               <CANT_REFER_UMB>?</CANT_REFER_UMB>
               <UXC>?</UXC>
               <FRACCION>?</FRACCION>
               <TOTAL>?</TOTAL>
               <UMB>?</UMB>
               <DIFERENCIA>?</DIFERENCIA>
               <MOTIVO_PED>?</MOTIVO_PED>
               <DES_MOTIVO_PED>?</DES_MOTIVO_PED>
               <SOLICITANTE>?</SOLICITANTE>
               <POS_PED_SC>?</POS_PED_SC>
               <POS_PED_FRAC>?</POS_PED_FRAC>
               <ES_CANT_NULA>?</ES_CANT_NULA>
               <BOTON_X_LOTES>?</BOTON_X_LOTES>
               <ICON_X_LOTES>?</ICON_X_LOTES>
               <FACT_CONV>?</FACT_CONV>
               <ACUMULADO>?</ACUMULADO>
               <ANULA>?</ANULA>
               <EXTRA>?</EXTRA>
               <NEXTRA>?</NEXTRA>
               <DISABLE>?</DISABLE>
               <POS_MVT>?</POS_MVT>
               <MOTIVO_MOV>?</MOTIVO_MOV>
               <DES_MOTIVO_MOV>?</DES_MOTIVO_MOV>
               <COLOR>?</COLOR>
               <ES_SINCARGO>?</ES_SINCARGO>
               <NTRGA_POSTERIOR>?</NTRGA_POSTERIOR>
               <POS_ENTR_DISTB>?</POS_ENTR_DISTB>
               <EAN_ALT>?</EAN_ALT>
               <EAN11>?</EAN11>
               <PRECIO_UNI>?</PRECIO_UNI>
               <MON>?</MON>
               <POSITIVO>?</POSITIVO>
               <TOTAL_PRECIO>?</TOTAL_PRECIO>
               <PMP_CESION>?</PMP_CESION>
            </item>
         </T_POS>
      </urn:ZWD_GET_POSICIONES_ENTRADA>
   </soapenv:Body>
</soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
            //console.log(data);
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            let itemsDOM = Array.from(dom.getElementsByTagName('TPos')[0].children);

            let posiciones: Element[] = [];
            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);
               if (detalle[1].innerHTML !== '' && detalle[1].innerHTML !== '0')
                  posiciones.push(new Element(
                     Number(detalle[0].innerHTML),
                     detalle[1].innerHTML,
                     detalle[2].innerHTML,
                     detalle[4].innerHTML,
                     detalle[3].innerHTML,
                  ));
            });


            let itemsDOM2 = Array.from(dom.getElementsByTagName('ToReturn')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);
               this.codigo = detalle2[2].innerHTML;
            });

            this.currPedido = idPedido;
            this.currPosiciones = posiciones;
            return {
               codigo: this.codigo,
               posiciones: posiciones
            };
         })
         .pipe(
            catchError(this.handleError)
         );
   }

   obtenerArticulo(idArticulo: string,
      codCentro: string): Observable<any> {
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

            datosArticulo = new DatosArticulo(
               codigo,
               descripcion,
               +caja,
               +retractil,
               +manto,
               +palet,
               codError,
               mensajeError,

            );

            this.datosArticulos.push(datosArticulo);
            return datosArticulo;
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







