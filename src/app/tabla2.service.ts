import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import * as X2JS from 'x2js';
import { Element } from './Element';
import 'rxjs/add/operator/timeout';
import { DatosArticulo } from './_entities/DatosArticulo';
import { Ean } from './_entities/Ean';
import { Stock } from './_entities/Stock';
import { Motivo } from './_entities/Motivo';
import { AlertType } from './_entities/Alert';
import { AlertService } from './_services/alert.service';


@Injectable({
   providedIn: 'root'
})
export class Tabla2Service {

   codigo: string;
   mensaje: string;
   codMotivo: string;

   constructor(private http: HttpClient, private alert: AlertService) { }

   public currPedido: string;
   public currAlbaran: string;
   public currPosiciones: Element[];
   public datosArticulos: DatosArticulo[] = [];
   public motivosMov: Motivo[] = [];
   public eansArticulos: Ean[] = [];
   public currCentro: string;
   public stock: Stock;
   public stocks: Stock[] = [];

   obtenerPosiciones(idPedido: string, albaran: string,
      codCentro: string): Observable<Element[]> {
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

         
            let itemsDOM = Array.from(dom.getElementsByTagName('T_POS')[0].children);

            let posiciones: Element[] = [];
             
            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);
               if (detalle[1].innerHTML !== '' && detalle[1].innerHTML !== '0') {
                  posiciones.push(new Element(
                     Number(detalle[0].innerHTML),
                     detalle[1].innerHTML,
                     detalle[2].innerHTML,
                     detalle[4].innerHTML,
                     +detalle[3].innerHTML,
                     +detalle[3].innerHTML,
                     0, ''
                  ));
               }
            });


            const itemsDOM2 = Array.from(dom.getElementsByTagName('TO_RETURN')[0].children);
            itemsDOM2.forEach(item => {
               const detalle2 = Array.from(item.children);
               if ( detalle2[0].innerHTML == 'E' )
                {   this.codigo = '4' ;
                    this.mensaje = detalle2[3].innerHTML; 
                    this.alert.sendAlert(this.mensaje, AlertType.Error);
                     }
                     else     {        this.codigo = '0'; }
            });

         
            this.currPedido = idPedido;
            this.currPosiciones = posiciones;
            
            return  posiciones;
            
            
         });
         /* .pipe(
            catchError(this.handleError)
         ); */
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

   obtenerEans(codigo: string,
      codCentro: string): Observable<any> {


      // let url = 'http://mar3prdd22.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_get_posiciones_entrada/100/zwd_get_posiciones_entrada/zwd_get_posiciones_entrada';
      let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:ZWD_LISTA_EAN>
            <!--Optional:-->
            <I_ALTERNATIVOS></I_ALTERNATIVOS>
            <!--Optional:-->
            <I_IDNLF></I_IDNLF>
            <!--Optional:-->
            <I_MATNR>123</I_MATNR>
            <I_WERKS>0021</I_WERKS>
            <T_LIS_EAN>
               <!--Zero or more repetitions:-->
               <item>
                  <MATNR></MATNR>
                  <MAKTX></MAKTX>
                  <MAKTM></MAKTM>
                  <EAN11></EAN11>
                  <MEINH></MEINH>
                  <UMREZ></UMREZ>
                  <MEINS></MEINS>
                  <ERSDA></ERSDA>
                  <NUMTP></NUMTP>
                  <ALTERNATIVO></ALTERNATIVO>
                  <BORRADO></BORRADO>
               </item>
            </T_LIS_EAN>
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
         </urn:ZWD_LISTA_EAN>
      </soapenv:Body>
   </soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
            //console.log(data);
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            let itemsDOM = Array.from(dom.getElementsByTagName('T_LIS_EAN')[0].children);

            let eansArticulo: Ean[] = [];
            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);

               if (detalle[1].innerHTML !== '' && detalle[1].innerHTML !== '0')
                  eansArticulo.push(new Ean(
                     detalle[0].innerHTML, //codigo
                     detalle[3].innerHTML, //Ean
                  ));
               this.eansArticulos.push(new Ean(
                  detalle[0].innerHTML, //codigo
                  detalle[3].innerHTML, //Ean
               ));
            });

            let codigo;
            let itemsDOM2 = Array.from(dom.getElementsByTagName('T_RETURN')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);
               codigo = +detalle2[2].innerHTML;
            });
            //console.log( "codigo= " + codigo);


            return {
               codigo: codigo,
               eansArticulo: eansArticulo
            };
         })
         .pipe(
            catchError(this.handleError)
         );
   }

   obtenerStock(codigo: string,
      codCentro: string): Observable<any> {

      let url = 'http://localhost:8088/mockZ_GET_STOCK_MATERIALES'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:ZGetStockMateriales>
            <!--Optional:-->
            <ILoadOtrosStocks>X</ILoadOtrosStocks>
            <!--Optional:-->
            <IOnlyMinimoMaximo></IOnlyMinimoMaximo>
            <IWerks>0021</IWerks>
            <TiMateriales>
               <!--Zero or more repetitions:-->
               <item>
                  <Mandt></Mandt>
                  <Matnr>2813</Matnr>
                  <Ersda></Ersda>
                  <Ernam></Ernam>
                  <Laeda></Laeda>
                  <Aenam></Aenam>
                  <Vpsta></Vpsta>
                  <Pstat></Pstat>
                  <Lvorm></Lvorm>
                  <Mtart></Mtart>
                  <Mbrsh></Mbrsh>
                  <Matkl></Matkl>
                  <Bismt></Bismt>
                  <Meins></Meins>
                  <Bstme></Bstme>
                  <Zeinr></Zeinr>
                  <Zeiar></Zeiar>
                  <Zeivr></Zeivr>
                  <Zeifo></Zeifo>
                  <Aeszn></Aeszn>
                  <Blatt></Blatt>
                  <Blanz></Blanz>
                  <Ferth></Ferth>
                  <Formt></Formt>
                  <Groes></Groes>
                  <Wrkst></Wrkst>
                  <Normt></Normt>
                  <Labor></Labor>
                  <Ekwsl></Ekwsl>
                  <Brgew></Brgew>
                  <Ntgew></Ntgew>
                  <Gewei></Gewei>
                  <Volum></Volum>
                  <Voleh></Voleh>
                  <Behvo></Behvo>
                  <Raube></Raube>
                  <Tempb></Tempb>
                  <Disst></Disst>
                  <Tragr></Tragr>
                  <Stoff></Stoff>
                  <Spart></Spart>
                  <Kunnr></Kunnr>
                  <Eannr></Eannr>
                  <Wesch></Wesch>
                  <Bwvor></Bwvor>
                  <Bwscl></Bwscl>
                  <Saiso></Saiso>
                  <Etiar></Etiar>
                  <Etifo></Etifo>
                  <Entar></Entar>
                  <Ean11></Ean11>
                  <Numtp></Numtp>
                  <Laeng></Laeng>
                  <Breit></Breit>
                  <Hoehe></Hoehe>
                  <Meabm></Meabm>
                  <Prdha></Prdha>
                  <Aeklk></Aeklk>
                  <Cadkz></Cadkz>
                  <Qmpur></Qmpur>
                  <Ergew></Ergew>
                  <Ergei></Ergei>
                  <Ervol></Ervol>
                  <Ervoe></Ervoe>
                  <Gewto></Gewto>
                  <Volto></Volto>
                  <Vabme></Vabme>
                  <Kzrev></Kzrev>
                  <Kzkfg></Kzkfg>
                  <Xchpf></Xchpf>
                  <Vhart></Vhart>
                  <Fuelg></Fuelg>
                  <Stfak></Stfak>
                  <Magrv></Magrv>
                  <Begru></Begru>
                  <Datab></Datab>
                  <Liqdt></Liqdt>
                  <Saisj></Saisj>
                  <Plgtp></Plgtp>
                  <Mlgut></Mlgut>
                  <Extwg></Extwg>
                  <Satnr></Satnr>
                  <Attyp></Attyp>
                  <Kzkup></Kzkup>
                  <Kznfm></Kznfm>
                  <Pmata></Pmata>
                  <Mstae></Mstae>
                  <Mstav></Mstav>
                  <Mstde></Mstde>
                  <Mstdv></Mstdv>
                  <Taklv></Taklv>
                  <Rbnrm></Rbnrm>
                  <Mhdrz></Mhdrz>
                  <Mhdhb></Mhdhb>
                  <Mhdlp></Mhdlp>
                  <Inhme></Inhme>
                  <Inhal></Inhal>
                  <Vpreh></Vpreh>
                  <Etiag></Etiag>
                  <Inhbr></Inhbr>
                  <Cmeth></Cmeth>
                  <Cuobf></Cuobf>
                  <Kzumw></Kzumw>
                  <Kosch></Kosch>
                  <Sprof></Sprof>
                  <Nrfhg></Nrfhg>
                  <Mfrpn></Mfrpn>
                  <Mfrnr></Mfrnr>
                  <Bmatn></Bmatn>
                  <Mprof></Mprof>
                  <Kzwsm></Kzwsm>
                  <Saity></Saity>
                  <Profl></Profl>
                  <Ihivi></Ihivi>
                  <Iloos></Iloos>
                  <Serlv></Serlv>
                  <Kzgvh></Kzgvh>
                  <Xgchp></Xgchp>
                  <Kzeff></Kzeff>
                  <Compl></Compl>
                  <Iprkz></Iprkz>
                  <Rdmhd></Rdmhd>
                  <Przus></Przus>
                  <MtposMara></MtposMara>
                  <Bflme></Bflme>
                  <Matfi></Matfi>
                  <Cmrel></Cmrel>
                  <Bbtyp></Bbtyp>
                  <SledBbd></SledBbd>
                  <GtinVariant></GtinVariant>
                  <Gennr></Gennr>
                  <Rmatp></Rmatp>
                  <GdsRelevant></GdsRelevant>
                  <Weora></Weora>
                  <HutypDflt></HutypDflt>
                  <Pilferable></Pilferable>
                  <Whstc></Whstc>
                  <Whmatgr></Whmatgr>
                  <Hndlcode></Hndlcode>
                  <Hazmat></Hazmat>
                  <Hutyp></Hutyp>
                  <TareVar></TareVar>
                  <Maxc></Maxc>
                  <MaxcTol></MaxcTol>
                  <Maxl></Maxl>
                  <Maxb></Maxb>
                  <Maxh></Maxh>
                  <MaxdimUom></MaxdimUom>
                  <Herkl></Herkl>
                  <Mfrgr></Mfrgr>
                  <Qqtime></Qqtime>
                  <Qqtimeuom></Qqtimeuom>
                  <Qgrp></Qgrp>
                  <Serial></Serial>
                  <PsSmartform></PsSmartform>
                  <Logunit></Logunit>
                  <Cwqrel></Cwqrel>
                  <Cwqproc></Cwqproc>
                  <Cwqtolgr></Cwqtolgr>
                  <Adprof></Adprof>
                  <AnimalOrigin></AnimalOrigin>
                  <TextileCompInd></TextileCompInd>
                  <_-bev1_-luleinh></_-bev1_-luleinh>
                  <_-bev1_-luldegrp></_-bev1_-luldegrp>
                  <_-bev1_-nestruccat></_-bev1_-nestruccat>
                  <_-dsd_-slToltyp></_-dsd_-slToltyp>
                  <_-dsd_-svCntGrp></_-dsd_-svCntGrp>
                  <_-dsd_-vcGroup></_-dsd_-vcGroup>
                  <_-vso_-rTiltInd></_-vso_-rTiltInd>
                  <_-vso_-rStackInd></_-vso_-rStackInd>
                  <_-vso_-rBotInd></_-vso_-rBotInd>
                  <_-vso_-rTopInd></_-vso_-rTopInd>
                  <_-vso_-rStackNo></_-vso_-rStackNo>
                  <_-vso_-rPalInd></_-vso_-rPalInd>
                  <_-vso_-rPalOvrD></_-vso_-rPalOvrD>
                  <_-vso_-rPalOvrW></_-vso_-rPalOvrW>
                  <_-vso_-rPalBHt></_-vso_-rPalBHt>
                  <_-vso_-rPalMinH></_-vso_-rPalMinH>
                  <_-vso_-rTolBHt></_-vso_-rTolBHt>
                  <_-vso_-rNoPGvh></_-vso_-rNoPGvh>
                  <_-vso_-rQuanUnit></_-vso_-rQuanUnit>
                  <_-vso_-rKzgvhInd></_-vso_-rKzgvhInd>
                  <Packcode></Packcode>
                  <DgPackStatus></DgPackStatus>
                  <Mcond></Mcond>
                  <Retdelc></Retdelc>
                  <LoglevReto></LoglevReto>
                  <Nsnid></Nsnid>
                  <Imatn></Imatn>
                  <Picnum></Picnum>
                  <Bstat></Bstat>
                  <ColorAtinn></ColorAtinn>
                  <Size1Atinn></Size1Atinn>
                  <Size2Atinn></Size2Atinn>
                  <Color></Color>
                  <Size1></Size1>
                  <Size2></Size2>
                  <FreeChar></FreeChar>
                  <CareCode></CareCode>
                  <BrandId></BrandId>
                  <FiberCode1></FiberCode1>
                  <FiberPart1></FiberPart1>
                  <FiberCode2></FiberCode2>
                  <FiberPart2></FiberPart2>
                  <FiberCode3></FiberCode3>
                  <FiberPart3></FiberPart3>
                  <FiberCode4></FiberCode4>
                  <FiberPart4></FiberPart4>
                  <FiberCode5></FiberCode5>
                  <FiberPart5></FiberPart5>
                  <Fashgrd></Fashgrd>
                  <Zzfraccionable></Zzfraccionable>
                  <Zzobsequio></Zzobsequio>
                  <Zzdenominacion></Zzdenominacion>
                  <Zzcalibre></Zzcalibre>
                  <Zzcategoria></Zzcategoria>
                  <Zztipoalcohol></Zztipoalcohol>
                  <Zzlitros></Zzlitros>
                  <Zzgrados></Zzgrados>
                  <Zzepigrafe></Zzepigrafe>
                  <Zziddeposito></Zziddeposito>
                  <Zzproddescat></Zzproddescat>
                  <Zzraae></Zzraae>
                  <Zzcomposicion></Zzcomposicion>
                  <Zzdevol></Zzdevol>
                  <Zzclasaran></Zzclasaran>
                  <Zzpartent></Zzpartent>
                  <Zzulitros></Zzulitros>
                  <Zzugrados></Zzugrados>
                  <ZzfactorNeto></ZzfactorNeto>
                  <Zzlote></Zzlote>
                  <ZzfecVolumetria></ZzfecVolumetria>
                  <Zzaiem></Zzaiem>
                  <Zzgrplato></Zzgrplato>
                  <Zzpadre></Zzpadre>
                  <Zzprioridad></Zzprioridad>
                  <Zzagregar></Zzagregar>
               </item>
            </TiMateriales>
            <ToStock>
               <!--Zero or more repetitions:-->
               <item>
                  <Werks></Werks>
                  <Lgort></Lgort>
                  <Matnr></Matnr>
                  <Labst></Labst>
                  <StockCompra></StockCompra>
                  <StockVenta></StockVenta>
                  <Prwog></Prwog>
                  <Prwug></Prwug>
                  <UnidadBase></UnidadBase>
                  <Sobst></Sobst>
                  <StockSeguridad></StockSeguridad>
                  <CoberturaObjetivo></CoberturaObjetivo>
                  <StockActual></StockActual>
                  <EntradasPrevistas></EntradasPrevistas>
                  <StockPrevisto></StockPrevisto>
                  <NecesidadReapro></NecesidadReapro>
                  <Ciclo></Ciclo>
                  <DescripcionCiclo></DescripcionCiclo>
                  <StockEnCurso></StockEnCurso>
                  <PuntoPedido></PuntoPedido>
                  <StockTransito></StockTransito>
                  <StockExpedido></StockExpedido>
                  <StockProforma></StockProforma>
                  <StockPedido></StockPedido>
               </item>
            </ToStock>
         </urn:ZGetStockMateriales>
      </soapenv:Body>
   </soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
            //console.log(data);
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            let itemsDOM = Array.from(dom.getElementsByTagName('ToStock')[0].children);

            let codigo = 4;
            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);

               if (detalle[2].innerHTML !== '' && detalle[2].innerHTML !== '0') {
                  codigo = 0;
                  this.stock = new Stock(
                     detalle[2].innerHTML, //codigo
                     +detalle[5].innerHTML, // stock venta
                     +detalle[19].innerHTML // stock pedido
                  );
               }


            });

            this.stocks.push(this.stock);

            //console.log( "codigo= " + codigo);


            return {
               codigo: codigo,
               stock: this.stock
            };
         })
         .pipe(
            catchError(this.handleError)
         );
   }


   obtenerMotivos(): Observable<any> {
      // let url = 'http://mar3prdd22.miquel.es:8003/sap/bc/srt/rfc/sap/zwd_get_posiciones_entrada/100/zwd_get_posiciones_entrada/zwd_get_posiciones_entrada';
      let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:ZWD_MM_MATCH_MOTIVO_MOV>
            <!--Optional:-->
            <I_BWART></I_BWART>
            <!--Optional:-->
            <I_LOAD_NOSAP_MOTIV>X</I_LOAD_NOSAP_MOTIV>
            <!--Optional:-->
            <I_MOV_BACKOFF>002</I_MOV_BACKOFF>
            <TO_FOUND_MOV>
               <!--Zero or more repetitions:-->
               <item>
                  <MANDT></MANDT>
                  <SPRAS></SPRAS>
                  <BWART></BWART>
                  <GRUND></GRUND>
                  <GRTXT></GRTXT>
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
         </urn:ZWD_MM_MATCH_MOTIVO_MOV>
      </soapenv:Body>
   </soapenv:Envelope>
   `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {

           //console.log(data);
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            // obtener tipos  movimiento
            let itemsDOM = Array.from(dom.getElementsByTagName('TO_FOUND_MOV')[0].children);


            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);

               if ((detalle[3].innerHTML !== '') && (detalle[3].innerHTML !== '0')) {

                  this.motivosMov.push(new Motivo(
                     detalle[3].innerHTML,
                     detalle[4].innerHTML,
                     
                  ));
               }
            });

            let itemsDOM2 = Array.from(dom.getElementsByTagName('TO_RETURN')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);
               this.codMotivo = detalle2[2].innerHTML;
            });


            return {
               motivosMov: this.motivosMov,
               codigo: this.codMotivo,
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







