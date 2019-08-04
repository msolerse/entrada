import { Component, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DIR_DOCUMENT_FACTORY } from '@angular/cdk/bidi/typings/dir-document-token';
import { Router, ActivatedRoute } from '@angular/router';
import { SeleccionService} from './seleccion.service';
import { DatosCentro } from '../_entities/DatosCentro';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';


export interface Food {
  value: string;
  viewValue: string;
}

export interface Mov {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent implements OnInit {

  foods: Food[] = [
    {value: 'Pedido-0', viewValue: 'Pedido'},
    {value: 'Entrega-1', viewValue: 'Entrega'}
  ];
  movs: Mov[] = [
    {value: 'Previo', viewValue: 'Proveedor Pedido Previo'},
    {value: 'Plataforma', viewValue: 'Distribución Plataforma'}
  ];
  
  codCentro: string = '0000';
  descCentro: string ;
  documento: string ;
  albaran: string = '12345-ABC';
  observaciones: string = "hola que tal";
  tipoDoc: string = 'Pedido-0';
  tipoMov: string = 'Previo';

  idProceso: string = '001';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: SeleccionService,
    private alert: AlertService) { }

  ngOnInit() {

    let params = new URLSearchParams(location.search);
    let idCentro = params.get("idCentro");
    console.log("idCentro="+idCentro);

    if  (this.service.currDatosCentro ) {
      this.codCentro =  this.service.currDatosCentro.codigo;
      this.descCentro = this.service.currDatosCentro.nombre; }
    else    
      this.service.obtenerCentro( idCentro ).subscribe(data => {
        
        console.log("datoscentro="+JSON.stringify(data));
        console.log(" codigo retornat"+data.codError);
        switch (+data.codError) {

          case 0:
              this.codCentro = data.codigo;
              this.descCentro = data.nombre;
            
          default:
              this.alert.sendAlert('Error al obtener los datos del centro', AlertType.Error);
              break;
        };    
          
      }); 


    this.service.obtenerTiposMov ( this.idProceso ).subscribe(data => {
      
      
      switch (+data.codError) {

        case 0:
            
            
          
      default:
            this.alert.sendAlert('Error al obtener los datos del centro', AlertType.Error);
            break;
      };    
         
    }); 


  }
  
goValidacion() {
  this.router.navigate(['tabla2',  this.documento,  this.codCentro, { albaran: this.albaran} ]);
}

}
