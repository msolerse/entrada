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
import { DatosArticuloProv } from './_entities/DatosArticuloProv';
import { ArticuloDescService } from './_services/articuloDesc.service';
import { ReturnMessage } from './_entities/ReturnMessage';
import { environment } from '../environments/environment';
import { Unidades} from './_entities/Unidades';

@Injectable({
   providedIn: 'root'
})
export class Tabla2Service {

   codigo: string;
   mensaje: string;
   codMotivo: string;

   constructor(private http: HttpClient, private alert: AlertService,
      private ads: ArticuloDescService) { }

   public currPedido: string;
   public currAlbaran: string;
   public currPosiciones: Element[];
   public datosArticulos: DatosArticulo[] = [];
   public motivosMov: Motivo[] = [];
   public eansArticulos: Ean[] = [];
   public currCentro: string;
   public stock: Stock;
   public stocks: Stock[] = [];
   public currProveedor: string;
   public currDatosArticuloProv: DatosArticuloProv[];
   public currTipoMov: string;
   public tiped: string;
   public provCabeceraWs: string;
   public tipoDocRefer: string;

   public eanFiltered: boolean;
   public loadEans: boolean;

   public pageSize: number;
   public pageIndex: number;
   public unidades: Unidades[] = [];


   obtenerPosiciones(idPedido: string, albaran: string,
      codCentro: string, tipoDoc: string, tipoMov: string): Observable<Element[]> {


      //let url = 'http://localhost:8088/mockZCO_PDA_ENTRADA'
      let url: string;
      let nombreFuncion: string;

      if (tipoMov == '004') {
         url = environment.serviceUrl + '/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/'+ environment.serviceCode + '/zwd_cabecera_entrada/zwd_cabecera_entrada';
         nombreFuncion = 'ZWD_MM_GET_POS_DOCREF';
      }
      else {
         url =  environment.serviceUrl + '/sap/bc/srt/rfc/sap/zco_pda_entrada/' + environment.serviceCode+'/zco_pda_entrada/zco_pda_entrada';
         nombreFuncion = 'ZWD_GET_POSICIONES_ENTRADA';
      }


      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:${nombreFuncion}>
            <E_CABECERA>
               <CENTRO>${codCentro}</CENTRO>
               <DES_CENTRO></DES_CENTRO>
               <ALMACEN></ALMACEN>
               <FECHA_CONTAB></FECHA_CONTAB>
               <CLASE_MOVIMIENTO>${tipoMov}</CLASE_MOVIMIENTO>
               <DES_TIPOMOV></DES_TIPOMOV>
               <PROVEEDOR></PROVEEDOR>
               <DESC_PROVEEDOR></DESC_PROVEEDOR>
               <NOTA_ENTREGA></NOTA_ENTREGA>
               <TIPO_DOC_REFER>${tipoDoc}</TIPO_DOC_REFER>
               <DES_TIPO_DOC_REF></DES_TIPO_DOC_REF>
               <DOCUMENTO_REFER>${idPedido}</DOCUMENTO_REFER>
               <MOTIVO_PED></MOTIVO_PED>
               <MOTIVO_MOV></MOTIVO_MOV>
               <DES_MOTIVO_MOV></DES_MOTIVO_MOV>
               <OBSERVACIONES></OBSERVACIONES>
               <CENTRO_DES></CENTRO_DES>
               <DES_CENTRO_DES></DES_CENTRO_DES>
               <ALMACEN_DES></ALMACEN_DES>
               <DOCUMENTO_MAT></DOCUMENTO_MAT>
               <DOCUMENTO_MAT_AUX></DOCUMENTO_MAT_AUX>
               <YEAR></YEAR>
               <NOMBRE></NOMBRE>
               <MATRICULA></MATRICULA>
               <DOCUMENTO_REFER_ORIG></DOCUMENTO_REFER_ORIG>
               <TIPO_DOC_REFER_ORIG></TIPO_DOC_REFER_ORIG>
               <POSITIVO></POSITIVO>
               <ES_SIN_CARGO></ES_SIN_CARGO>
               <USUARIO></USUARIO>
               <MERMA></MERMA>
               <ES_ENTREGA_PARC></ES_ENTREGA_PARC>
               <DOCUMENTO_REFER_PARENT></DOCUMENTO_REFER_PARENT>
               <TIPO_DOC_REFER_PARENT></TIPO_DOC_REFER_PARENT>
               <TIPED></TIPED>
               <REF_VTA></REF_VTA>
               <DOC_REFER_INTERNAL></DOC_REFER_INTERNAL>
               <DOCUMENTO_REFER_REAL></DOCUMENTO_REFER_REAL>
               <TIPO_DOC_REFER_REAL></TIPO_DOC_REFER_REAL>
               <VALORACION></VALORACION>
            </E_CABECERA>
            <!--Optional:-->
            <I_VALIDACION_ALT></I_VALIDACION_ALT>
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
            <!--Optional:-->
            <T_LOTES>
               <!--Zero or more repetitions:-->
               <item>
                  <POSICION></POSICION>
                  <MATERIAL></MATERIAL>
                  <CANTIDAD></CANTIDAD>
                  <LOTE></LOTE>
                  <UNIDAD></UNIDAD>
                  <FECHA_CAD></FECHA_CAD>
                  <FECHA_ENV></FECHA_ENV>
                  <PESO></PESO>
                  <UNIDAD_PESO></UNIDAD_PESO>
                  <LOTES_AUTO></LOTES_AUTO>
                  <CONV_UN_BASE></CONV_UN_BASE>
               </item>
            </T_LOTES>
            <T_POS>
               <!--Zero or more repetitions:-->
               <item>
                  <POSICION></POSICION>
                  <MATERIAL></MATERIAL>
                  <DESC_MATERIAL></DESC_MATERIAL>
                  <CANTIDAD></CANTIDAD>
                  <UNIDAD_MEDIDA></UNIDAD_MEDIDA>
                  <CANT_SIN_CARGO></CANT_SIN_CARGO>
                  <LOTE></LOTE>
                  <CANTIDAD_REFER></CANTIDAD_REFER>
                  <UN_MEDIDA_ENT></UN_MEDIDA_ENT>
                  <CANT_REFER_UMB></CANT_REFER_UMB>
                  <UXC></UXC>
                  <FRACCION></FRACCION>
                  <TOTAL></TOTAL>
                  <UMB></UMB>
                  <DIFERENCIA></DIFERENCIA>
                  <MOTIVO_PED></MOTIVO_PED>
                  <DES_MOTIVO_PED></DES_MOTIVO_PED>
                  <SOLICITANTE></SOLICITANTE>
                  <POS_PED_SC></POS_PED_SC>
                  <POS_PED_FRAC></POS_PED_FRAC>
                  <ES_CANT_NULA></ES_CANT_NULA>
                  <BOTON_X_LOTES></BOTON_X_LOTES>
                  <ICON_X_LOTES></ICON_X_LOTES>
                  <FACT_CONV></FACT_CONV>
                  <ACUMULADO></ACUMULADO>
                  <ANULA></ANULA>
                  <EXTRA></EXTRA>
                  <NEXTRA></NEXTRA>
                  <DISABLE></DISABLE>
                  <POS_MVT></POS_MVT>
                  <MOTIVO_MOV></MOTIVO_MOV>
                  <DES_MOTIVO_MOV></DES_MOTIVO_MOV>
                  <COLOR></COLOR>
                  <ES_SINCARGO></ES_SINCARGO>
                  <NTRGA_POSTERIOR></NTRGA_POSTERIOR>
                  <POS_ENTR_DISTB></POS_ENTR_DISTB>
                  <EAN_ALT></EAN_ALT>
                  <EAN11></EAN11>
                  <PRECIO_UNI></PRECIO_UNI>
                  <MON></MON>
                  <POSITIVO></POSITIVO>
                  <TOTAL_PRECIO></TOTAL_PRECIO>
                  <PMP_CESION></PMP_CESION>
               </item>
            </T_POS>
         </urn:${nombreFuncion}>
      </soapenv:Body>
   </soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
           
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            this.tiped = dom.getElementsByTagName("TIPED")[0].innerHTML;
          
            this.provCabeceraWs = dom.getElementsByTagName("PROVEEDOR")[0].innerHTML;
            this.tipoDocRefer = dom.getElementsByTagName("TIPO_DOC_REFER")[0].innerHTML;

            let itemsDOM = Array.from(dom.getElementsByTagName('T_POS')[0].children);

            let posiciones: Element[] = [];
            let factConv: number;

            itemsDOM.forEach(item => {

               let detalle = Array.from(item.children);
               let cant = +detalle[3].innerHTML;

               factConv = +detalle[23].innerHTML;
               /* if (tipoMov == '003' && cant != 0) {
                  factConv = factConv / cant;
               } */
               if (factConv == 0) { factConv = 1; }
            

               if (detalle[1].innerHTML !== '' && detalle[1].innerHTML !== '0') {
                  posiciones.push(new Element(
                     Number(detalle[0].innerHTML),
                     detalle[1].innerHTML,
                     detalle[2].innerHTML,
                     detalle[4].innerHTML,
                     detalle[4].innerHTML,
                     +detalle[3].innerHTML,
                     +detalle[3].innerHTML,
                     0, '',
                     +detalle[9].innerHTML, //cantreferUmb
                     detalle[13].innerHTML, // UMb
                     factConv, // factConv
                     detalle[35].innerHTML, //posrefer
                     ''
                  ));
               }
            });


            const itemsDOM2 = Array.from(dom.getElementsByTagName('TO_RETURN')[0].children);
            this.codigo = '0';
            itemsDOM2.forEach(item => {
               const detalle2 = Array.from(item.children);
               if (detalle2[0].innerHTML == 'E') {
                  this.codigo = '4';
                  this.mensaje = detalle2[3].innerHTML;
                  this.alert.sendAlert(this.mensaje, AlertType.Error);
               }


            });

            if ((this.codigo == '0') && (posiciones.length > 0)) {

               this.currPedido = idPedido;
               this.currPosiciones = posiciones;
            }

           
            return posiciones;


         })
         .pipe(
            catchError(this.handleError)
         );
   }

   obtenerArticulo(idArticulo: string,
      codCentro: string): Observable<any> {

      let proveedor: string;

      if (this.currTipoMov == '003' || this.currTipoMov == '002' || this.currTipoMov == '004')
         proveedor = this.provCabeceraWs;
      else
         proveedor = '';

      let url = environment.serviceUrl +'/sap/bc/srt/rfc/sap/zco_pda_entrada/'+environment.serviceCode+'/zco_pda_entrada/zco_pda_entrada';
      //let url = 'http://localhost:8088/mockZCO_PDA_ENTRADA'
      let body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZWD_MM_DATOS_ARTICULO3>
         <!--Optional:-->
         <IDNLF></IDNLF>
         <!--Optional:-->
         <LIFNR>${proveedor}</LIFNR>
         <!--Optional:-->
         <MATNR>${idArticulo}</MATNR>
         <UM>
            <!--Zero or more repetitions:-->
            <item>
               <MEINH></MEINH>
               <MSEH3></MSEH3>
               <MSEHT></MSEHT>
               <UMREZ></UMREZ>
               <UMREN></UMREN>
            </item>
         </UM>
         <WERKS>${codCentro}</WERKS>
      </urn:ZWD_MM_DATOS_ARTICULO3>
   </soapenv:Body>
</soapenv:Envelope>
        `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
          
            var datosArticulo;
            var codError;
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);



            let codigo = dom.getElementsByTagName("MATNR")[0].innerHTML;
            let descripcion = dom.getElementsByTagName("MAKTX")[0].innerHTML;
            let caja = dom.getElementsByTagName("CAJA")[0].innerHTML;
            let retractil = dom.getElementsByTagName("RETRACTIL")[0].innerHTML;
            let manto = dom.getElementsByTagName("MANTO")[0].innerHTML;
            let palet = dom.getElementsByTagName("PALET")[0].innerHTML;
            let umb = dom.getElementsByTagName("UMB")[0].innerHTML;

            let mensajeError = dom.getElementsByTagName("ERROR")[0].innerHTML;
           

            if (codigo != null && !(codigo.length == 0))
               codError = 0;
            else
               codError = 4;


            this.ads.changeMessage(descripcion);


                // obtener unidades
                let itemsDOM3 = Array.from(dom.getElementsByTagName('UM')[0].children);

                let units = [];
                itemsDOM3.forEach(item => {
                   let detalle3 = Array.from(item.children);
                 
    
                   if ((detalle3[1].innerHTML !== '') && (detalle3[1].innerHTML !== '0')) {
    
                      units.push(new Unidades(
                         detalle3[1].innerHTML,
                         detalle3[1].innerHTML
                      ));
                   }
                });

            datosArticulo = new DatosArticulo(
               codigo,
               descripcion,
               +caja,
               +retractil,
               +manto,
               +palet,
               umb,
               units,
               codError,
               mensajeError
            );

            this.datosArticulos.push(datosArticulo);

        

           
           // return datosArticulo;

             return {
               datosArticulo: datosArticulo
            }; 


         })
         .pipe(
            catchError(this.handleError)
         );
   }

   obtenerEans(codigo: string,
      codCentro: string, pos?: Element[]): Observable<any> {


      let url= environment.serviceUrl+'/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/'+environment.serviceCode+'/zwd_cabecera_entrada/zwd_cabecera_entrada';
      //let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:ZWD_LISTA_EAN>
            <!--Optional:-->
            <I_ALTERNATIVOS></I_ALTERNATIVOS>
            <!--Optional:-->
            <I_IDNLF></I_IDNLF>
            <!--Optional:--> `;
      if (codigo != '0') {
         body +=
            `
            <I_MATNR>${codigo}</I_MATNR>
            <I_WERKS>${codCentro}</I_WERKS>
            <T_LIS_EAN>
               <!--Zero or more repetitions:-->`;
      } else {
         body +=
            `
   <I_MATNR></I_MATNR>
   <I_WERKS>${codCentro}</I_WERKS>
   <T_LIS_EAN>
      <!--Zero or more repetitions:-->`;
      }

      if (codigo != '0') {
         body +=
            `
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
        `;
      }
      else {

         pos.forEach(posi => {
            body += `
            <item>
            <MATNR>${posi.codigo}</MATNR>
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
            `;
         });

      }

      body += `</T_LIS_EAN>
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
           
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            let itemsDOM = Array.from(dom.getElementsByTagName('T_LIS_EAN')[0].children);

            let eansArticulo: Ean[] = [];
            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);
              
               if ((detalle[0].innerHTML !== '') && (detalle[0].innerHTML !== '0')) {
                  //  if (codigo != '0') {
                  eansArticulo.push(new Ean(
                     detalle[0].innerHTML, //codigo
                     detalle[3].innerHTML, //Ean
                  ));
                  //}
                  this.eansArticulos.push(new Ean(
                     detalle[0].innerHTML, //codigo
                     detalle[3].innerHTML, //Ean
                  ));
               }
            });

           
            let codigo;
            let itemsDOM2 = Array.from(dom.getElementsByTagName('T_RETURN')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);
               codigo = +detalle2[2].innerHTML;
            });
            

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

      //    let url = 'http://localhost:8088/mockZ_GET_STOCK_MATERIALES'
      let url = environment.serviceUrl +'/sap/bc/srt/rfc/sap/zwd_pda_stock_articulo/'+environment.serviceCode+'/zwd_pda_stock_articulo/zwd_pda_stock_articulo';
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZwdPdaStockArticulo>
         <ICentro>${codCentro}</ICentro>
         <IMaterial>${codigo}</IMaterial>
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
      </urn:ZwdPdaStockArticulo>
   </soapenv:Body>
</soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
           
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

            return {
               codigo: codigo,
               stock: this.stock
            };
         })
         .pipe(
            catchError(this.handleError)
         );
   }


   obtenerArticulosProv(proveedor: string,
      codCentro: string): Observable<any> {


      let url = environment.serviceUrl +'/sap/bc/srt/rfc/sap/zwd_pda_ent_mercancia_n/'+ environment.serviceCode+'/zwd_pda_ent_mercancia_n/zwd_pda_ent_mercancia_n';
      //let url = 'http://localhost:8088/mockZWD_PDA_ENT_MERCANCIA_N'
      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZwdPdaEntMercanciaN>
         <ILifnr>${proveedor}</ILifnr>
         <IWerks>${codCentro}</IWerks>
         <TMatnr>
            <!--Zero or more repetitions:-->
            <item>
               <Lgpbe></Lgpbe>
               <Matnr></Matnr>
               <Meins></Meins>
               <MengePl></MengePl>
               <Prwog></Prwog>
               <Prwug></Prwug>
               <Idnlf></Idnlf>
               <Ind></Ind>
               <Maktx></Maktx>
               <SuministraCash></SuministraCash>
               <SuministraCntro></SuministraCntro>
               <Plataforma></Plataforma>
               <DescrPlataforma></DescrPlataforma>
               <PsenPrior></PsenPrior>
               <Devolucion></Devolucion>
            </item>
         </TMatnr>
         <ToEan>
            <!--Zero or more repetitions:-->
            <item>
               <Mandt></Mandt>
               <Matnr></Matnr>
               <Meinh></Meinh>
               <Lfnum></Lfnum>
               <Ean11></Ean11>
               <Eantp></Eantp>
               <Hpean></Hpean>
            </item>
         </ToEan>
         <ToReturn>
            <!--Zero or more repetitions:-->
            <item>
               <Type></Type>
               <Id></Id>
               <Number></Number>
               <Message></Message>
               <LogNo></LogNo>
               <LogMsgNo></LogMsgNo>
               <MessageV1></MessageV1>
               <MessageV2></MessageV2>
               <MessageV3></MessageV3>
               <MessageV4></MessageV4>
               <Parameter></Parameter>
               <Row></Row>
               <Field></Field>
               <System></System>
            </item>
         </ToReturn>
         <ToUm>
            <!--Zero or more repetitions:-->
            <item>
               <Matnr></Matnr>
               <Meinh></Meinh>
               <Mseh3></Mseh3>
               <Mseht></Mseht>
               <Umrez></Umrez>
               <Umren></Umren>
            </item>
         </ToUm>
      </urn:ZwdPdaEntMercanciaN>
   </soapenv:Body>
</soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
            
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);


            let itemsDOM = Array.from(dom.getElementsByTagName('TMatnr')[0].children);

            let articulosProv: DatosArticuloProv[] = [];
            this.eansArticulos = [];
            itemsDOM.forEach(item => {
               let detalle = Array.from(item.children);

               if (detalle[1].innerHTML !== '' && detalle[1].innerHTML !== '0')
                  articulosProv.push(new DatosArticuloProv(
                     detalle[1].innerHTML, //codigo
                     detalle[8].innerHTML, //descripcion
                     detalle[6].innerHTML, //cod proveedor
                     detalle[0].innerHTML, //ubicacion
                     detalle[7].innerHTML, //descatalogado
                     +detalle[3].innerHTML, //stock Compras
                     +detalle[4].innerHTML, //stock Maximo
                     +detalle[5].innerHTML, //stock Minimo
                  ));
            });
            // eans

            let itemsDOM3 = Array.from(dom.getElementsByTagName('ToEan')[0].children);

            let eansArticulo: Ean[] = [];
            itemsDOM3.forEach(item => {
               let detalle = Array.from(item.children);

               if (detalle[1].innerHTML !== '' && detalle[1].innerHTML !== '0')

                  this.eansArticulos.push(new Ean(
                     detalle[1].innerHTML, //codigo
                     detalle[4].innerHTML, //Ean
                  ));
            });

            // return

            let codigo;
            let itemsDOM2 = Array.from(dom.getElementsByTagName('ToReturn')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);
               codigo = +detalle2[2].innerHTML;
            });
           
            this.currProveedor = proveedor;
            this.currDatosArticuloProv = articulosProv;
            return {
               codigo: codigo,
               DatosArticuloProv: articulosProv
            };
         })
         .pipe(
            catchError(this.handleError)
         );
   }


   obtenerMotivos(): Observable<any> {
      let url =  environment.serviceUrl +'/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/'+environment.serviceCode+'/zwd_cabecera_entrada/zwd_cabecera_entrada';
      //let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'
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


   validarEntrada(pos: Element[]): Observable<any> {

      let DateObj = new Date();
      let currDate = DateObj.getFullYear() + '-' + ('0' + (DateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + DateObj.getDate()).slice(-2);

      let url =  environment.serviceUrl +'/sap/bc/srt/rfc/sap/zwd_cabecera_entrada/'+environment.serviceCode+'/zwd_cabecera_entrada/zwd_cabecera_entrada';
      //let url = 'http://localhost:8088/mockZWD_CABECERA_ENTRADA'

      let tiped: string;
      let proveedor: string;


      switch (this.currTipoMov) {
         case '001':
            tiped = '006';
            proveedor = this.currProveedor;
            this.tipoDocRefer = '';
            this.currPedido = '';
            break;
         case '002':
            tiped = this.tiped;
            proveedor = this.provCabeceraWs;
            break;
         case '003':
            tiped = '006';
            proveedor = this.provCabeceraWs;
            break;
         case '004':
            tiped = '007';
            proveedor = this.provCabeceraWs;
            break;
      }

      let body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
         <urn:ZWD_MM_GESTION_STOCKS>
            <E_CABECERA>
               <CENTRO>${this.currCentro}</CENTRO>
               <DES_CENTRO></DES_CENTRO>
               <ALMACEN>0001</ALMACEN>
               <FECHA_CONTAB>${currDate}</FECHA_CONTAB>
               <CLASE_MOVIMIENTO>${this.currTipoMov}</CLASE_MOVIMIENTO>
               <DES_TIPOMOV></DES_TIPOMOV>
               <PROVEEDOR>${proveedor}</PROVEEDOR>
               <DESC_PROVEEDOR></DESC_PROVEEDOR>
               <NOTA_ENTREGA>${this.currAlbaran}</NOTA_ENTREGA>
               <TIPO_DOC_REFER>${this.tipoDocRefer}</TIPO_DOC_REFER>
               <DES_TIPO_DOC_REF></DES_TIPO_DOC_REF>
               <DOCUMENTO_REFER>${this.currPedido}</DOCUMENTO_REFER>
               <MOTIVO_PED></MOTIVO_PED>
               <MOTIVO_MOV></MOTIVO_MOV>
               <DES_MOTIVO_MOV></DES_MOTIVO_MOV>
               <OBSERVACIONES></OBSERVACIONES>
               <CENTRO_DES></CENTRO_DES>
               <DES_CENTRO_DES></DES_CENTRO_DES>
               <ALMACEN_DES></ALMACEN_DES>
               <DOCUMENTO_MAT></DOCUMENTO_MAT>
               <DOCUMENTO_MAT_AUX></DOCUMENTO_MAT_AUX>
               <YEAR></YEAR>
               <NOMBRE></NOMBRE>
               <MATRICULA></MATRICULA>
               <DOCUMENTO_REFER_ORIG></DOCUMENTO_REFER_ORIG>
               <TIPO_DOC_REFER_ORIG></TIPO_DOC_REFER_ORIG>
               <POSITIVO></POSITIVO>
               <ES_SIN_CARGO></ES_SIN_CARGO>
               <USUARIO></USUARIO>
               <MERMA></MERMA>
               <ES_ENTREGA_PARC></ES_ENTREGA_PARC>
               <DOCUMENTO_REFER_PARENT></DOCUMENTO_REFER_PARENT>
               <TIPO_DOC_REFER_PARENT></TIPO_DOC_REFER_PARENT>
               <TIPED>${tiped}</TIPED>
               <REF_VTA></REF_VTA>
               <DOC_REFER_INTERNAL></DOC_REFER_INTERNAL>
               <DOCUMENTO_REFER_REAL></DOCUMENTO_REFER_REAL>
               <TIPO_DOC_REFER_REAL></TIPO_DOC_REFER_REAL>
               <VALORACION></VALORACION>
            </E_CABECERA>
            <!--Optional:-->
            <E_CABECERA_NOM>
               <NOMBRE_PROV></NOMBRE_PROV>
               <CALLE></CALLE>
               <NUMERO_EDIF></NUMERO_EDIF>
               <COD_POSTAL></COD_POSTAL>
               <POBLACION></POBLACION>
               <TELEFONO></TELEFONO>
               <NIF></NIF>
               <COD_PAIS></COD_PAIS>
               <PAIS></PAIS>
            </E_CABECERA_NOM>
            <E_MATERIAL_PRIN>
               <POSICION></POSICION>
               <MATERIAL></MATERIAL>
               <DESC_MATERIAL></DESC_MATERIAL>
               <CANTIDAD></CANTIDAD>
               <UNIDAD_MEDIDA></UNIDAD_MEDIDA>
               <CANT_SIN_CARGO></CANT_SIN_CARGO>
               <LOTE></LOTE>
               <CANTIDAD_REFER></CANTIDAD_REFER>
               <UN_MEDIDA_ENT></UN_MEDIDA_ENT>
               <CANT_REFER_UMB></CANT_REFER_UMB>
               <UXC></UXC>
               <FRACCION></FRACCION>
               <TOTAL></TOTAL>
               <UMB></UMB>
               <DIFERENCIA></DIFERENCIA>
               <MOTIVO_PED></MOTIVO_PED>
               <DES_MOTIVO_PED></DES_MOTIVO_PED>
               <SOLICITANTE></SOLICITANTE>
               <POS_PED_SC></POS_PED_SC>
               <POS_PED_FRAC></POS_PED_FRAC>
               <ES_CANT_NULA></ES_CANT_NULA>
               <BOTON_X_LOTES></BOTON_X_LOTES>
               <ICON_X_LOTES></ICON_X_LOTES>
               <FACT_CONV></FACT_CONV>
               <ACUMULADO></ACUMULADO>
               <ANULA></ANULA>
               <EXTRA></EXTRA>
               <NEXTRA></NEXTRA>
               <DISABLE></DISABLE>
               <POS_MVT></POS_MVT>
               <MOTIVO_MOV></MOTIVO_MOV>
               <DES_MOTIVO_MOV></DES_MOTIVO_MOV>
               <COLOR></COLOR>
               <ES_SINCARGO></ES_SINCARGO>
               <NTRGA_POSTERIOR></NTRGA_POSTERIOR>
               <POS_ENTR_DISTB></POS_ENTR_DISTB>
               <EAN_ALT></EAN_ALT>
               <EAN11></EAN11>
               <PRECIO_UNI></PRECIO_UNI>
               <MON></MON>
               <POSITIVO></POSITIVO>
               <TOTAL_PRECIO></TOTAL_PRECIO>
               <PMP_CESION></PMP_CESION>
            </E_MATERIAL_PRIN>
            <!--Optional:-->
            <I_MOV_ADICIONAL></I_MOV_ADICIONAL>
            <!--Optional:-->
            <I_VALIDACION_ALT></I_VALIDACION_ALT>
            <!--Optional:-->
            <I_VIS></I_VIS>
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
            <!--Optional:-->
            <T_LOTES>
               <!--Zero or more repetitions:-->
               <item>
                  <POSICION></POSICION>
                  <MATERIAL></MATERIAL>
                  <CANTIDAD></CANTIDAD>
                  <LOTE></LOTE>
                  <UNIDAD></UNIDAD>
                  <FECHA_CAD></FECHA_CAD>
                  <FECHA_ENV></FECHA_ENV>
                  <PESO></PESO>
                  <UNIDAD_PESO></UNIDAD_PESO>
                  <LOTES_AUTO></LOTES_AUTO>
                  <CONV_UN_BASE></CONV_UN_BASE>
               </item>
            </T_LOTES>
            <T_POS>
               <!--Zero or more repetitions:-->   
      `;

      pos.forEach(posi => {

         switch (this.currTipoMov) {
            case '001':

               let total = posi.comment * posi.FactConv;

               body += `
            <item>
               <POSICION>${posi.id}</POSICION>
               <MATERIAL>${posi.codigo}</MATERIAL>
               <DESC_MATERIAL>${posi.name}</DESC_MATERIAL>
               <CANTIDAD>${posi.comment}</CANTIDAD>
               <UNIDAD_MEDIDA>${posi.symbol}</UNIDAD_MEDIDA>
               <CANT_SIN_CARGO></CANT_SIN_CARGO>
               <LOTE></LOTE>
               <CANTIDAD_REFER></CANTIDAD_REFER>
               <UN_MEDIDA_ENT>${posi.symbol}</UN_MEDIDA_ENT>
               <CANT_REFER_UMB></CANT_REFER_UMB>
               <UXC></UXC>
               <FRACCION></FRACCION>
               <TOTAL></TOTAL>
               <UMB>${posi.symbol}</UMB>
               <DIFERENCIA></DIFERENCIA>
               <MOTIVO_PED></MOTIVO_PED>
               <DES_MOTIVO_PED></DES_MOTIVO_PED>
               <SOLICITANTE></SOLICITANTE>
               <POS_PED_SC></POS_PED_SC>
               <POS_PED_FRAC></POS_PED_FRAC>
               <ES_CANT_NULA></ES_CANT_NULA>
               <BOTON_X_LOTES></BOTON_X_LOTES>
               <ICON_X_LOTES></ICON_X_LOTES>
               <FACT_CONV></FACT_CONV>
               <ACUMULADO></ACUMULADO>
               <ANULA></ANULA>
               <EXTRA></EXTRA>
               <NEXTRA></NEXTRA>
               <DISABLE></DISABLE>
               <POS_MVT></POS_MVT>
               <MOTIVO_MOV></MOTIVO_MOV>
               <DES_MOTIVO_MOV></DES_MOTIVO_MOV>
               <COLOR></COLOR>
               <ES_SINCARGO></ES_SINCARGO>
               <NTRGA_POSTERIOR></NTRGA_POSTERIOR>
               <POS_ENTR_DISTB></POS_ENTR_DISTB>
               <EAN_ALT></EAN_ALT>
               <EAN11></EAN11>
               <PRECIO_UNI></PRECIO_UNI>
               <MON></MON>
               <POSITIVO></POSITIVO>
               <TOTAL_PRECIO></TOTAL_PRECIO>
               <PMP_CESION></PMP_CESION>
            </item>
            `;
               break;

            case '002': case '003': case '004':
               let cantidad = +(posi.comment * posi.FactConv).toFixed(3);
               let diferencia = +(cantidad - posi.cantrefUmb).toFixed(3);
               let factConv = 1;
               let nextra = posi.extra == 'X' ? '' : 'X';
               if (this.currTipoMov != '002')
                   { posi.motivo = ''; }

               body += `
               <item>
                  <POSICION>${posi.id}</POSICION>
                  <MATERIAL>${posi.codigo}</MATERIAL>
                  <DESC_MATERIAL>${posi.name}</DESC_MATERIAL>
                  <CANTIDAD>${cantidad}</CANTIDAD>
                  <UNIDAD_MEDIDA>${posi.umb}</UNIDAD_MEDIDA>
                  <CANT_SIN_CARGO></CANT_SIN_CARGO>
                  <LOTE></LOTE>
                  <CANTIDAD_REFER>${posi.cantrefUmb}</CANTIDAD_REFER>
                  <UN_MEDIDA_ENT>${posi.umb}</UN_MEDIDA_ENT>
                  <CANT_REFER_UMB>${posi.cantrefUmb}</CANT_REFER_UMB>
                  <UXC>${cantidad}</UXC>
                  <FRACCION></FRACCION>
                  <TOTAL>${cantidad}</TOTAL>
                  <UMB>${posi.umb}</UMB>
                  <DIFERENCIA>${diferencia}</DIFERENCIA>
                  <MOTIVO_PED></MOTIVO_PED>
                  <DES_MOTIVO_PED></DES_MOTIVO_PED>
                  <SOLICITANTE></SOLICITANTE>
                  <POS_PED_SC></POS_PED_SC>
                  <POS_PED_FRAC></POS_PED_FRAC>
                  <ES_CANT_NULA></ES_CANT_NULA>
                  <BOTON_X_LOTES></BOTON_X_LOTES>
                  <ICON_X_LOTES></ICON_X_LOTES>
                  <FACT_CONV>${factConv}</FACT_CONV>
                  <ACUMULADO></ACUMULADO>
                  <ANULA></ANULA>
                  <EXTRA>${posi.extra}</EXTRA>
                  <NEXTRA>${nextra}</NEXTRA>
                  <DISABLE></DISABLE>
                  <POS_MVT></POS_MVT>
                  <MOTIVO_MOV>${posi.motivo}</MOTIVO_MOV>
                  <DES_MOTIVO_MOV></DES_MOTIVO_MOV>
                  <COLOR></COLOR>
                  <ES_SINCARGO></ES_SINCARGO>
                  <NTRGA_POSTERIOR></NTRGA_POSTERIOR>
                  <POS_ENTR_DISTB>${posi.posRefer}</POS_ENTR_DISTB>
                  <EAN_ALT></EAN_ALT>
                  <EAN11></EAN11>
                  <PRECIO_UNI></PRECIO_UNI>
                  <MON></MON>
                  <POSITIVO></POSITIVO>
                  <TOTAL_PRECIO></TOTAL_PRECIO>
                  <PMP_CESION></PMP_CESION>
               </item>
               `;
               break;
         }
      });

      body += `
      </T_POS>
      </urn:ZWD_MM_GESTION_STOCKS>
   </soapenv:Body>
</soapenv:Envelope>
      `;

      return this.http.post(url, body, { responseType: 'text' })
         .map(data => {
            
            //let x2js = require('x2js');
            let x2js = new X2JS();
            let dom = x2js.xml2dom(data);
            let returnMessages: ReturnMessage[] = [];


            let codigo;
            let itemsDOM2 = Array.from(dom.getElementsByTagName('TO_RETURN')[0].children);
            itemsDOM2.forEach(item => {
               let detalle2 = Array.from(item.children);

               if ((detalle2[0].innerHTML !== '') && (detalle2[0].innerHTML !== 'W')) {
                  //  if (codigo != '0') {
                  returnMessages.push(new ReturnMessage(
                     detalle2[0].innerHTML, // tipo
                     detalle2[3].innerHTML, // Mensaje
                  ));
               }

            });
            
            return {
               returnMessages: returnMessages
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







