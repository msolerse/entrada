import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import * as X2JS from 'x2js';
import { Element } from './Element';

@Injectable({
  providedIn: 'root'
})
export class Tabla2Service {

  codigo: string;

  constructor(private http: HttpClient) { }

 obtenerPosiciones (idPedido: string ,  albaran: string , 
    codCentro: string ) : Observable<any> {
     // let url = 'http://mar3prdd22.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_get_posiciones_entrada/100/zwd_get_posiciones_entrada/zwd_get_posiciones_entrada';
      let url = 'http://localhost:8088/mockZWD_GET_POSICIONES_ENTRADA'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZwdGetPosicionesEntrada>
         <ECabecera>
            <Centro>?</Centro>
            <DesCentro>?</DesCentro>
            <Almacen>?</Almacen>
            <FechaContab>?</FechaContab>
            <ClaseMovimiento>?</ClaseMovimiento>
            <DesTipomov>?</DesTipomov>
            <Proveedor>?</Proveedor>
            <DescProveedor>?</DescProveedor>
            <NotaEntrega>?</NotaEntrega>
            <TipoDocRefer>?</TipoDocRefer>
            <DesTipoDocRef>?</DesTipoDocRef>
            <DocumentoRefer>?</DocumentoRefer>
            <MotivoPed>?</MotivoPed>
            <MotivoMov>?</MotivoMov>
            <DesMotivoMov>?</DesMotivoMov>
            <Observaciones>?</Observaciones>
            <CentroDes>?</CentroDes>
            <DesCentroDes>?</DesCentroDes>
            <AlmacenDes>?</AlmacenDes>
            <DocumentoMat>?</DocumentoMat>
            <DocumentoMatAux>?</DocumentoMatAux>
            <Year>?</Year>
            <Nombre>?</Nombre>
            <Matricula>?</Matricula>
            <DocumentoReferOrig>?</DocumentoReferOrig>
            <TipoDocReferOrig>?</TipoDocReferOrig>
            <Positivo>?</Positivo>
            <EsSinCargo>?</EsSinCargo>
            <Usuario>?</Usuario>
            <Merma>?</Merma>
            <EsEntregaParc>?</EsEntregaParc>
            <DocumentoReferParent>?</DocumentoReferParent>
            <TipoDocReferParent>?</TipoDocReferParent>
            <Tiped>?</Tiped>
            <RefVta>?</RefVta>
            <DocReferInternal>?</DocReferInternal>
            <DocumentoReferReal>?</DocumentoReferReal>
            <TipoDocReferReal>?</TipoDocReferReal>
            <Valoracion>?</Valoracion>
         </ECabecera>
         <!--Optional:-->
         <IValidacionAlt>?</IValidacionAlt>
         <!--Optional:-->
         <TLotes>
            <!--Zero or more repetitions:-->
            <item>
               <Posicion>?</Posicion>
               <Material>?</Material>
               <Cantidad>?</Cantidad>
               <Lote>?</Lote>
               <Unidad>?</Unidad>
               <FechaCad>?</FechaCad>
               <FechaEnv>?</FechaEnv>
               <Peso>?</Peso>
               <UnidadPeso>?</UnidadPeso>
               <LotesAuto>?</LotesAuto>
               <ConvUnBase>?</ConvUnBase>
            </item>
         </TLotes>
         <TPos>
            <!--Zero or more repetitions:-->
            <item>
               <Posicion>?</Posicion>
               <Material>?</Material>
               <DescMaterial>?</DescMaterial>
               <Cantidad>?</Cantidad>
               <UnidadMedida>?</UnidadMedida>
               <CantSinCargo>?</CantSinCargo>
               <Lote>?</Lote>
               <CantidadRefer>?</CantidadRefer>
               <UnMedidaEnt>?</UnMedidaEnt>
               <CantReferUmb>?</CantReferUmb>
               <Uxc>?</Uxc>
               <Fraccion>?</Fraccion>
               <Total>?</Total>
               <Umb>?</Umb>
               <Diferencia>?</Diferencia>
               <MotivoPed>?</MotivoPed>
               <DesMotivoPed>?</DesMotivoPed>
               <Solicitante>?</Solicitante>
               <PosPedSc>?</PosPedSc>
               <PosPedFrac>?</PosPedFrac>
               <EsCantNula>?</EsCantNula>
               <BotonXLotes>?</BotonXLotes>
               <IconXLotes>?</IconXLotes>
               <FactConv>?</FactConv>
               <Acumulado>?</Acumulado>
               <Anula>?</Anula>
               <Extra>?</Extra>
               <Nextra>?</Nextra>
               <Disable>?</Disable>
               <PosMvt>?</PosMvt>
               <MotivoMov>?</MotivoMov>
               <DesMotivoMov>?</DesMotivoMov>
               <Color>?</Color>
               <EsSincargo>?</EsSincargo>
               <NtrgaPosterior>?</NtrgaPosterior>
               <PosEntrDistb>?</PosEntrDistb>
               <EanAlt>?</EanAlt>
               <Ean11>?</Ean11>
               <PrecioUni>?</PrecioUni>
               <Mon>?</Mon>
               <Positivo>?</Positivo>
               <TotalPrecio>?</TotalPrecio>
               <PmpCesion>?</PmpCesion>
            </item>
         </TPos>
         <!--Optional:-->
         <ToReturn>
            <!--Zero or more repetitions:-->
            <item>
               <Type>?</Type>
               <Id>?</Id>
               <Number>?</Number>
               <Message>?</Message>
               <LogNo>?</LogNo>
               <LogMsgNo>?</LogMsgNo>
               <MessageV1>?</MessageV1>
               <MessageV2>?</MessageV2>
               <MessageV3>?</MessageV3>
               <MessageV4>?</MessageV4>
               <Parameter>?</Parameter>
               <Row>?</Row>
               <Field>?</Field>
               <System>?</System>
            </item>
         </ToReturn>
      </urn:ZwdGetPosicionesEntrada>
   </soapenv:Body>
</soapenv:Envelope>
      `;
  
      return this.http.post(url, body, { responseType: 'text' })
      .map(data => {
        console.log(data);
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
           this.codigo =  detalle2[2].innerHTML;
          });
        
          return {
            codigo: this.codigo,
            posiciones: posiciones
          };
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







