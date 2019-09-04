import { Component, OnInit, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Tabla2Service } from '../tabla2.service';
import { Element } from '../Element';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatosArticulo } from '../_entities/DatosArticulo';
import { Motivo } from '../_entities/Motivo';
import { SearchArticuloService } from '../search-articulo/search-articulo.service';
import { isUndefined } from 'util';
import { ToolbarService } from '../_services/toolbar.service';
import { ArticuloDescService } from '../_services/articuloDesc.service';


@Component({
  selector: 'app-tabla2',
  templateUrl: './tabla2.component.html',
  styleUrls: ['./tabla2.component.scss']
})
export class Tabla2Component {

  motivos: Motivo[];

  posiciones: Element[];
 
  dataSource: ExampleDataSource;// = new ExampleDataSource(initialData);
  entireDataSource: ExampleDataSource;// = new ExampleDataSource(initialData);

  displayedColumns: string[] ;
  idPedido: string;
  albaran: string;
  codCentro: string;
  routingSubscription: any;
  tipoMov: string;
  codProv: string;

  newCodigo: string;
  newName: string;
  newSymbol: string = 'CJ';
  newComment: number;
  newMotivo: string;

  isExpanded: boolean;
  showAlbaran: boolean;

  unis: Uni[] = [
    { value: 'UN', viewValue: 'UN' },
    { value: 'CJ', viewValue: 'CJ' },
    { value: 'RET', viewValue: 'RET' },
    { value: 'PAL', viewValue: 'PAL' },
  ];

  constructor(private route: ActivatedRoute,
              private router: Router, private service: Tabla2Service,
              private alert: AlertService, public dialog: MatDialog,
              private search: SearchArticuloService ,
              private ts: ToolbarService,
              private ads: ArticuloDescService) { }


  ngOnInit() {

    this.ads.changeMessage('');
    this.ads.currentMessage.subscribe(message => 
        this.newName = message);
    this.ts.changeMessage('Back');
    this.routingSubscription = this.route.params.subscribe(params => {
      this.idPedido = params["idPedido"];
      this.codCentro = params["codCentro"];
      this.service.currCentro = this.codCentro;
      this.albaran = params["albaran"];
      this.tipoMov = params["tipoMov"];
      this.service.currTipoMov = this.tipoMov;
      this.codProv = params['codProv'];
     

      if (  this.tipoMov == '002')
       { this.displayedColumns = ['codigo', 'name', 'symbol', 'cantref', 'comment', 'dif', 'motivo' , 'actionsColumn'];
      
         if ( this.service.motivosMov.length != 0) {
          this.motivos = this.service.motivosMov; }
       else  {
         this.service.obtenerMotivos().subscribe(data => {

          switch (+data.codigo) {
            case 0:
              
              this.motivos = data.motivosMov;
              break;
            default:
              this.alert.sendAlert('Error al obtener los Motivos.', AlertType.Error);
              break;
          }
        });
       }     
      }
      else if ( this.idPedido == '0' 
      )

      { this.displayedColumns = ['codigo', 'name', 'symbol',  'comment',  'actionsColumn']; }
      else
       { this.displayedColumns = ['codigo', 'name', 'symbol', 'cantref', 'comment', 'dif', 'actionsColumn']; }
      
      if (this.codProv && ( this.codProv !== this.service.currProveedor ) ) {
       this.service.obtenerArticulosProv(this.codProv, this.codCentro).subscribe(reply => {
        switch (reply.codigo) {
          case 0:
            console.log("ws datos art prov ok");
            break;

          default:
            console.log("ws datos art prov no ok");
            break;
        }
      });
    }

    });

    
   
    this.route.data
    .subscribe((data: { crisis: Element[] }) => {
      this.posiciones = data.crisis;
     // console.log( 'this.posiciones '+JSON.stringify(this.posiciones) );
      this.dataSource = new ExampleDataSource(this.posiciones);
      this.entireDataSource = new ExampleDataSource(this.posiciones);

      if (this.idPedido == '0' && this.posiciones.length == 0 ) {
      this.isExpanded = true;
        }

      if (this.search.codigo) {
      this.newCodigo = this.search.codigo;
      this.newName = this.search.nombre;
      this.isExpanded = true;
     // this.search.codigo = '';
      this.search.nombre = '';
    }
  });

    if ( !!this.albaran && this.albaran !== 'undefined' )
        { this.showAlbaran = true; }
    else
        {  this.showAlbaran = false; }

    document.getElementById('filtrar').focus(); 

  }

  public changeCodigo() {


    this.service.obtenerArticulo(this.newCodigo, this.codCentro).subscribe(reply => {
      switch (reply.codError) {
        case 0:
          this.alert.sendAlert(reply.mensaje, AlertType.Success);
          this.newName = reply.descripcion;
          break;
        default:
          this.alert.sendAlert(reply.mensaje, AlertType.Error);
          break;
      }

    });

  }

  anyadir(f: any) {
    
    this.addPosicion(this.newCodigo, this.newName, this.newSymbol, this.newComment, this.newMotivo);
    f.form.reset();
    this.newSymbol = 'UN';
    this.newSymbol = 'CJ';
    console.log("this.newSymbol="+this.newSymbol);

  }

  goSearchArticulo() {
    this.router.navigate(['search-articulo']);
  }

  addPosicion(codigo: string, name: string, symbol: string, comment: number, motivo: string) {

    let maxId: number;

    if ((this.dataSource.data()) && (this.dataSource.data().length !== 0)) {
      //console.log("length="+this.dataSource.data().length);
      maxId = Math.max.apply(Math, this.dataSource.data().map(o => o.id)) + 10;
    } else {
      maxId = 10;
    }

    this.entireDataSource.data().push({
      id: maxId,
      codigo: codigo,
      name: name,
      symbol: symbol,
      cantref: comment,
      comment: comment,
      dif: 0,
      motivo: motivo
    });

    const copy = this.entireDataSource.data().filter(row => row);
    this.dataSource.update(copy);
    this.entireDataSource.update(copy);
    this.service.currPosiciones = this.entireDataSource.data();

  }


  update(el: Element, comment: string) {
    if (comment == null) { return; }
    // copy and mutate
    //const copy = this.dataSource.data().slice()
    const copy = this.entireDataSource.data().slice()
    console.log('update comment = '+ comment);
    el.comment = +comment.split(';')[0];
    el.dif = el.comment - el.cantref ;
    el.motivo = comment.split(';')[1];
    // this.dataSource.update(copy);
    this.entireDataSource.update(copy);
    this.service.currPosiciones = this.entireDataSource.data();
  }
  remove(el: Element) {
    //console.log("inicial="+JSON.stringify(this.dataSource.data())) ;
    const copy = this.entireDataSource.data().filter(row => row != el);
    //console.log("copy="+JSON.stringify(copy)) ;

    this.dataSource.update(copy);
    this.entireDataSource.update(copy);
    this.service.currPosiciones = this.entireDataSource.data();
    //console.log("json="+JSON.stringify(this.dataSource.data())) ;
    //console.log( "adeu");
  }

  addRow(): void {

    const dialogRef = this.dialog.open(AddRowDialog, {
      width: '400px',
      data: { tipoMov: this.tipoMov, codCentro: this.codCentro }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.addPosicion(
        result.codigo,
        result.name,
        result.symbol,
        result.comment,
        result.motivo); }

    });

  }

  public doFilter = (value: string) => {
    // console.log (this.entireDataSource.data());
    this.dataSource.update(this.entireDataSource.data().filter(row => row));
    const copy = this.dataSource.data().filter(row => row.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()) ||
      row.codigo.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()));
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

  disconnect() { }
}

export interface DialogData {
  tipoMov: string;
  codCentro: string;
  codigo: string;
  name: string;
  symbol: string;
  comment: number;
  motivo: string;
  cancel: boolean;
}

export interface Uni {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'add-row-dialog',
  templateUrl: 'add-row-dialog.html',
  styleUrls: ['./add-row-dialog.scss']
})
export class AddRowDialog {

  motivos: Motivo[];

  unis: Uni[] = [
    { value: 'UN', viewValue: 'UN' },
    { value: 'CJ', viewValue: 'CJ' },
    { value: 'RET', viewValue: 'RET' },
    { value: 'PAL', viewValue: 'PAL' },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddRowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: Tabla2Service,
    private alert: AlertService,
    private ads: ArticuloDescService) {

      console.log("tipoMov= "+ data.tipoMov);
      this.data.symbol = 'CJ';
      this.motivos = this.service.motivosMov;
       //this.ads.changeMessage('');
      this.ads.currentMessage.subscribe(message => 
        this.data.name = message);
     }

  onNoClick(): void {
    this.dialogRef.close( 0 );
  }
/* 
  public changeCodigo() {
    // this.countChange = this.countChange + 1;

    this.service.obtenerArticulo(this.data.codigo, this.data.codCentro).subscribe(reply => {
      switch (reply.codError) {
        case 0:
          this.alert.sendAlert(reply.mensaje, AlertType.Success);
          this.data.name = reply.descripcion;
          break;
        default:
          this.alert.sendAlert(reply.mensaje, AlertType.Error);
          break;
      }

    });

  } */

}
