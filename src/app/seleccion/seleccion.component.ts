import { Component, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DIR_DOCUMENT_FACTORY } from '@angular/cdk/bidi/typings/dir-document-token';
import { Router, ActivatedRoute } from '@angular/router';

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
  documento: string = '0010153849';
  albaran: string = '12345-ABC';
  observaciones: string = "hola que tal";
  tipoDoc: string = 'Pedido-0';
  tipoMov: string = 'Previo';

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  
goValidacion() {
  this.router.navigate(['tabla2',  this.documento,  this.codCentro, { albaran: this.albaran} ]);
}

}
