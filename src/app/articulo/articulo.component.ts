import { Component, OnInit } from '@angular/core';
import { DatosArticulo } from '../_entities/DatosArticulo';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';
import { Tabla2Service} from '../tabla2.service';
import { Element } from '../Element';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {

  idPosicion: number;
  posicion: Element;
  datosArticulo: DatosArticulo;
  routingSubscription: any;

  constructor(private route: ActivatedRoute,
    private router: Router, 
     private alert: AlertService,
     private service: Tabla2Service,
     private location:Location)
      { }

  ngOnInit() {

    
    this.routingSubscription = this.route.params.subscribe(params => {
      this.idPosicion = params["idPosicion"];
      console.log("this.service.currPedido="+this.service.currPedido );
      //console.log("this.service.currPosiciones="+JSON.stringify( this.service.currPosiciones) );
     
      this.posicion = this.service.currPosiciones.filter( row => row.id == this.idPosicion )[0];
      
      console.log("codigo =" + this.posicion.codigo );
      console.log("datos articulos ="+JSON.stringify(  this.service.datosArticulos ));
      
      this.datosArticulo = this.service.datosArticulos.filter( row => row.codigo == this.posicion.codigo )[0];
      if  (!(this.datosArticulo))
      this.service.obtenerArticulo(this.posicion.codigo, "0051" ).subscribe(reply => {
        switch (reply.codError) {
          case 0:
            //this.alert.sendAlert(reply.mensaje, AlertType.Success);
            this.datosArticulo =  reply;
            console.log("caja = "+this.datosArticulo.caja+ "manto = "+this.datosArticulo.manto );
            break;
          default:
            this.alert.sendAlert(reply.mensaje, AlertType.Error);
            break;
        }
        
      });

    
    });
  }

 
    goBack(): void {
      this.location.back();
    
  }

}
