import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DIR_DOCUMENT_FACTORY } from '@angular/cdk/bidi/typings/dir-document-token';
import { Router, ActivatedRoute } from '@angular/router';
import { SeleccionService } from './seleccion.service';
import { DatosCentro } from '../_entities/DatosCentro';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';
import { TiposMov } from '../_entities/TiposMov';
import { TiposRef } from '../_entities/TiposRef';
import { Seleccion } from '../_entities/Seleccion';
import { DataService } from '../_services/data.service';
import { ToolbarService } from '../_services/toolbar.service';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit {

  tiposRef: TiposRef[] = [];
  tiposMov: TiposMov[] = [];

  model: Seleccion = new Seleccion('', '', '', '');

  codCentro: string;
  descCentro: string;
  //documento: string;
  //albaran: string;
  //proveedor: string;
  nombre: string;
  //observaciones: string;
  tipoDoc: string;
  tipoMov: string;

  idProceso: string = '001';
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: SeleccionService,
              private alert: AlertService,
              private data: DataService,
              private ts: ToolbarService) { }

  ngOnInit() {

    
    this.ts.changeMessage('Menu');

    if (this.alert.validacionOk) {
     
      this.initSeleccion();
    }

    this.data.currentMessage.subscribe(message => 
    //  this. = message.split(';')[0];
      this.nombre = message.split(';')[1]);
    let params = new URLSearchParams(location.search);
    let idCentro = params.get("idCentro");
    

    if (this.service.currDatosCentro) {
     
      this.codCentro = this.service.currDatosCentro.codigo;
      this.descCentro = this.service.currDatosCentro.nombre;
    }
    else {
     
      this.service.obtenerCentro(idCentro).subscribe(data => {

        switch (+data.codError) {

          case 0:
            this.codCentro = data.codigo;
            this.descCentro = data.nombre;
            break;

          default:
            this.alert.sendAlert('Error al obtener los datos del centro', AlertType.Error);
            break;
        };

      });
    }

    if (this.service.tiposMov.length != 0) {
    
      this.tiposMov = this.service.tiposMov;
      this.tiposRef = this.service.tiposRef;
    } else {
    
      this.service.obtenerTiposMov(this.idProceso).subscribe(data => {

        switch (+data.codigo) {
          case 0:
            this.tiposMov = data.tiposMov;
            this.tiposRef = data.tiposRef;
            this.tipoMov = this.tiposMov[1].tipMov;

            this.cargarTiposRef(this.tipoMov);
            this.tipoDoc = this.tiposRef[0].tipDocRef;

            break;

          default:
            this.alert.sendAlert('Error al obtener los tipos de movimiento', AlertType.Error);
            break;
        }

      });
    }


    if (this.service.currDocumento) {
      this.model.documento = this.service.currDocumento;
    }

    if (this.service.currTipoMov) {
      this.tipoMov = this.service.currTipoMov;
      this.cargarTiposRef(this.tipoMov);
    }

    if (this.service.currTipoDoc) {
      this.tipoDoc = this.service.currTipoDoc;
    }


    if (this.service.currProveedor) {
      
      this.model.proveedor = this.service.currProveedor;
     
    }

    if (this.service.currNombre) {
      this.nombre = this.service.currNombre;
    }

    if (this.service.currAlbaran) {
      this.model.albaran = this.service.currAlbaran;
    }

    if (this.service.currObservaciones) {
      this.model.observaciones = this.service.currObservaciones;
    }

   
  }
  onTipMovSelection() {

    this.cargarTiposRef(this.tipoMov);

    this.initSeleccion();

    if (this.tipoMov != '001')
      this.tipoDoc = this.tiposRef[0].tipDocRef;

      
  }

  initSeleccion() {

    this.service.currAlbaran = '';
    this.service.currDocumento = '';
    this.service.currProveedor = '';
    this.service.currNombre = '';
    this.service.currObservaciones = '';
    this.model.albaran = '';
    this.model.documento = '';
    this.model.proveedor = '';
    this.nombre = '';
    this.data.changeMessage('');

  }

  cargarTiposRef(tipMov: string) {
    this.tiposRef = this.service.tiposRef.filter(row => row.tipMov == tipMov);

  }

  goValidacion() {
    // guardar valores

    this.service.currDocumento = this.model.documento;
    this.service.currTipoMov = this.tipoMov;
    this.service.currTipoDoc = this.tipoDoc;
    this.service.currProveedor = this.model.proveedor;
    this.service.currNombre = this.nombre;
    this.service.currAlbaran = this.model.albaran;
    this.service.currObservaciones = this.model.observaciones;

    

    if (this.tipoMov == '001') {
     
      this.model.documento = '0';
    }

    this.router.navigate(['tabla2', this.model.documento, this.codCentro, { albaran: this.model.albaran , tipoMov: this.tipoMov, codProv: this.model.proveedor, tipoDoc: this.tipoDoc }]);
  }

  goTest() {
    this.router.navigate(['test', this.model.documento, this.codCentro, { albaran: this.model.albaran , tipoMov: this.tipoMov }]);
  }

}
