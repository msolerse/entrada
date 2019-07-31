import { Component, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DIR_DOCUMENT_FACTORY } from '@angular/cdk/bidi/typings/dir-document-token';
import { Router, ActivatedRoute } from '@angular/router';
import { SeleccionService} from './seleccion.service';

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
  
  codCentro: string = '0208';
  descCentro: string =  'GROS MERCAT FIGUERES';
  documento: string ;
  albaran: string = '12345-ABC';
  observaciones: string = "hola que tal";
  tipoDoc: string = 'Pedido-0';
  tipoMov: string = 'Previo';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: SeleccionService) { }

  ngOnInit() {

    let params = new URLSearchParams(location.search);
    let idCentro = params.get("idCentro");
    console.log("idCentro="+idCentro);
    /* this.service.obtenerPosiciones(this.idPedido, this.codCentro, this.albaran ).subscribe(data => {
      console.log( "ja he cridat");
      console.log( "codigo= "+data.codigo);
      switch (+data.codigo) {
        case 0:
            this.posiciones = data.posiciones;
          this.dataSource = new ExampleDataSource(this.posiciones);
          this.entireDataSource = new ExampleDataSource(this.posiciones);
      default:
            this.alert.sendAlert('Error al obtener las posiciones.', AlertType.Error);
            break;
      };    
         
    }); */
  }
  
goValidacion() {
  this.router.navigate(['tabla2',  this.documento,  this.codCentro, { albaran: this.albaran} ]);
}

}
