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


@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit {

  tiposRef: TiposRef[] = [];
  tiposMov: TiposMov[] = [];
  

  codCentro: string;
  descCentro: string;
  documento: string;
  albaran: string;
  observaciones: string;
  tipoDoc: string;
  tipoMov: string;

  idProceso: string = '001';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: SeleccionService,
              private alert: AlertService) { }

  ngOnInit() {

    let params = new URLSearchParams(location.search);
    let idCentro = params.get("idCentro");
    console.log("idCentro=" + idCentro);

    if (this.service.currDatosCentro) {
      console.log("ja tenim el centre"+ JSON.stringify(this.service.currDatosCentro) );
      this.codCentro = this.service.currDatosCentro.codigo;
      this.descCentro = this.service.currDatosCentro.nombre;
    }
    else {
      console.log("cridem ws centre");
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
      console.log('ja està ple tipos mov');
      this.tiposMov = this.service.tiposMov;
      this.tiposRef = this.service.tiposRef;
    } else {
      console.log('cridem wd tipos mov');
      this.service.obtenerTiposMov(this.idProceso).subscribe(data => {

        switch (+data.codigo) {
          case 0:
            this.tiposMov = data.tiposMov;
            this.tiposRef = data.tiposRef;
            this.tipoMov = this.tiposMov[1].tipMov;
            
            this.cargarTiposRef (this.tipoMov);
            this.tipoDoc = this.tiposRef[0].tipDocRef;

            break;

          default:
            this.alert.sendAlert('Error al obtener los tipos de movimiento', AlertType.Error);
            break;
        }

      });
    }

    if (this.service.currDocumento) {
       this.documento = this.service.currDocumento; }
    
    if (this.service.currTipoMov ) {
        this.tipoMov = this.service.currTipoMov;
        this.cargarTiposRef (this.tipoMov);
      }

    if (this.service.currTipoDoc ) {
        this.tipoDoc = this.service.currTipoDoc;
    }
   

       if (this.service.currAlbaran) {
        this.albaran = this.service.currAlbaran; }

        if (this.service.currObservaciones) {
          this.observaciones = this.service.currObservaciones; }
      
   
  }
  onTipMovSelection($event) {
    console.log(" changed tipo Mov="+  this.tipoMov);
    this.cargarTiposRef( this.tipoMov );
    this.tipoDoc = this.tiposRef[0].tipDocRef;
  }

  cargarTiposRef( tipMov: string)  {
     this.tiposRef = this.service.tiposRef.filter ( row => row.tipMov == tipMov);
    
  }

  goValidacion() {
   // guardar valores
   this.service.currDocumento = this.documento;
   this.service.currTipoMov = this.tipoMov;
   this.service.currTipoDoc = this.tipoDoc;
   this.service.currAlbaran = this.albaran;
   this.service.currObservaciones = this.observaciones;


    this.router.navigate(['tabla2', this.documento, this.codCentro, { albaran: this.albaran }]);
  }

}
