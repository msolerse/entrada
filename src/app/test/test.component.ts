import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Tabla2Service } from '../tabla2.service';
import { Element } from '../Element';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  idPedido: string;
  codCentro: string;
  albaran: string;
  posiciones: Element[];
  routingSubscription: any;
  codigo: number;

  constructor(private route: ActivatedRoute,
              private router: Router, private service: Tabla2Service,
              private alert: AlertService) { }

  ngOnInit() {
    this.routingSubscription = this.route.params.subscribe(params => {
      this.idPedido = params["idPedido"];
      this.codCentro = params["codCentro"];
      this.albaran = params["albaran"];
    });

    this.route.data
    .subscribe((data: { crisis: Element[] }) => {
      this.posiciones = data.crisis;

  
    });
   
  }

}
