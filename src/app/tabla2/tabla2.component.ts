import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject, of} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Tabla2Service} from '../tabla2.service';
import { Element } from '../Element';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';

@Component({
  selector: 'app-tabla2',
  templateUrl: './tabla2.component.html',
  styleUrls: ['./tabla2.component.scss']
})
export class Tabla2Component {

  posiciones: Element[];
  displayedColumns = ['codigo','name', 'symbol', 'comment', 'actionsColumn'];
   dataSource: ExampleDataSource;// = new ExampleDataSource(initialData);
   entireDataSource: ExampleDataSource;// = new ExampleDataSource(initialData);

  idPedido: string;
  albaran: string;
  codCentro: string;
  routingSubscription: any;

  constructor(private route: ActivatedRoute,
    private router: Router, private service: Tabla2Service,  private alert: AlertService) { }


  ngOnInit() {

    this.routingSubscription = this.route.params.subscribe(params => {
      this.idPedido = params["idPedido"];
      this.codCentro = params["codCentro"];
      this.albaran = params["albaran"];
      
      console.log("idPedido=" + this.idPedido );
      console.log("codCentro=" + this.codCentro );
      console.log("albaran=" + this.albaran );
    });


    this.service.obtenerPosiciones(this.idPedido, this.codCentro, this.albaran ).subscribe(data => {
      switch (+data.codigo) {
        case 0:
          this.posiciones = data.posiciones;
          this.dataSource = new ExampleDataSource(this.posiciones);
          this.entireDataSource = new ExampleDataSource(this.posiciones);
        

          break;
        default:
          this.alert.sendAlert('Error al obtener los tipos de embalajes.', AlertType.Error);
          break;
      }
    });

  }

  update(el: Element, comment: string) {
    if (comment == null) { return; }
    // copy and mutate
    //const copy = this.dataSource.data().slice()
    const copy = this.entireDataSource.data().slice()
    el.comment = comment;
   // this.dataSource.update(copy);
    this.entireDataSource.update(copy);
  }
  remove (el: Element ) {
    //console.log("inicial="+JSON.stringify(this.dataSource.data())) ;
    const copy =  this.entireDataSource.data().filter( row => row != el );
    //console.log("copy="+JSON.stringify(copy)) ;
    
    this.dataSource.update(copy);
    this.entireDataSource.update(copy);
    //console.log("json="+JSON.stringify(this.dataSource.data())) ;
    //console.log( "adeu");
  }

  addRow() {
    
    this.dataSource.data().push({
      id: 1,
      codigo: '30025',
      name: "Hydrogen",
      symbol: "CJ",
      comment: '20'
    });
    const copy = this.dataSource.data().filter( row => row );
    this.dataSource.update(copy);
    this.entireDataSource.update(copy);

  }

  public doFilter = (value: string) => {
    console.log (this.entireDataSource.data());
    this.dataSource.update(this.entireDataSource.data().filter( row => row ));
    const copy = this.dataSource.data().filter( row => row.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()) );
    this.dataSource.update(copy);
  }
  
  goBack() {
    this.router.navigate(['']);
  }

  goValidar() {
    console.log("Grabando!");
  }
}


//initialData: Element[] = this.posiciones;
/*const initialData: Element[] = [
  { id: 1, codigo: '30458', name: 'Coca Cola Lata 33 Cl', symbol: 'CJ', comment: '12' },
  { id: 2, codigo: '30000', name: 'Agua Font Vella 1,5 L', symbol: 'UN', comment: '24' },
  { id: 3, codigo: '49000', name: 'Leche Pascual Semi 1 L', symbol: 'CJ', comment: '10' },
  { id: 4, codigo: '21106', name: 'Azucar Blanco Refinado 1 Kg', symbol: 'CJ', comment: '15' },
];*/

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class ExampleDataSource extends DataSource<any> {

  private dataSubject = new BehaviorSubject<Element[]>([]);

  data() {
    return this.dataSubject.value;
  }

  update(data) {
    this.dataSubject.next(data);
  }

  constructor(data: any[]) {
    super();
    this.dataSubject.next(data);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return this.dataSubject;
  }

  disconnect() {}
}