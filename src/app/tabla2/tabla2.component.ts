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


@Component({
  selector: 'app-tabla2',
  templateUrl: './tabla2.component.html',
  styleUrls: ['./tabla2.component.scss']
})
export class Tabla2Component {

  motivos: Motivo[] =  [{ value: '12', viewValue: 'UN' },
  { value: '13', viewValue: 'CJ' }];

  posiciones: Element[];
 
  dataSource: ExampleDataSource;// = new ExampleDataSource(initialData);
  entireDataSource: ExampleDataSource;// = new ExampleDataSource(initialData);

  displayedColumns: string[] ;
  idPedido: string;
  albaran: string;
  codCentro: string;
  routingSubscription: any;
  tipoMov: string;

  newCodigo: string;
  newName: string;
  newSymbol: string;
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
    private search: SearchArticuloService ) { }


  ngOnInit() {

    this.routingSubscription = this.route.params.subscribe(params => {
      this.idPedido = params["idPedido"];
      this.codCentro = params["codCentro"];
      this.service.currCentro = this.codCentro;
      this.albaran = params["albaran"];
      this.tipoMov = params["tipoMov"];

      if (  this.tipoMov == '002')
       { this.displayedColumns = ['codigo', 'name', 'symbol', 'cantref', 'comment', 'dif', 'motivo' , 'actionsColumn'];
      
       if ( this.service.motivosMov.length != 0) {
        console.log("this.service.motivos="+ this.service.motivosMov);
          this.motivos = this.service.motivosMov; }
       else  {
         this.service.obtenerMotivos().subscribe(data => {

          console.log("codigo="+ +data.codigo);
          switch (+data.codigo) {
            case 0:
              
              this.motivos = data.motivosMov;
              console.log("this.motivos="+JSON.stringify(this.motivos));
            default:
              this.alert.sendAlert('Error al obtener los Motivos.', AlertType.Error);
              break;
          }
        });
       }     
      }
      else
       { this.displayedColumns = ['codigo', 'name', 'symbol', 'cantref', 'comment', 'dif', 'actionsColumn']; }

    });

    console.log ('this.idPedido='+this.idPedido);
    console.log ('this.service.currPedido=' + this.service.currPedido) ;
    if (this.idPedido == this.service.currPedido) {
      console.log("pedido igual , agafem posicions en memoria");
      this.posiciones = this.service.currPosiciones;
      this.dataSource = new ExampleDataSource(this.posiciones);
      this.entireDataSource = new ExampleDataSource(this.posiciones);
    } else {
      if (this.idPedido != '0') {
        console.log("pedido diferent , recuperem posicions ws");

        this.service.obtenerPosiciones(this.idPedido, this.codCentro, this.albaran).subscribe(data => {
    
          switch (+data.codigo) {
            case 0:
              this.posiciones = data.posiciones;
              this.dataSource = new ExampleDataSource(this.posiciones);
              this.entireDataSource = new ExampleDataSource(this.posiciones);
            default:
              this.alert.sendAlert('Error al obtener las posiciones.', AlertType.Error);
              break;
          }
        });
      } else {
        console.log("estem a entrades directes");

        if (this.albaran == this.service.currAlbaran) {
          console.log("albaran igual , agafem posicions en memoria");
  
          this.posiciones = this.service.currPosiciones; 
        } else {
          console.log("albaran diferent , inicialitzem posicions");
  
          this.posiciones = [];
          this.service.currAlbaran = this.albaran;
          this.service.currPedido = this.idPedido;
          this.isExpanded = true;
        }
        this.dataSource = new ExampleDataSource(this.posiciones);
        this.entireDataSource = new ExampleDataSource(this.posiciones);
        this.service.currPosiciones = this.posiciones;
      }
    }


    if (this.search.codigo) {
      this.newCodigo = this.search.codigo;
      this.newName = this.search.nombre;
      this.isExpanded = true;
      this.search.codigo = '';
      this.search.nombre = '';
    }


    if ( !!this.albaran && this.albaran !== 'undefined' )
        { this.showAlbaran = true; }
    else
        {  this.showAlbaran = false; }

   
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

  anyadir() {
    this.addPosicion(this.newCodigo, this.newName, this.newSymbol, this.newComment, this.newMotivo);
    console.log("vaig a borrar");
    this.newCodigo = '';
    this.newName = '';
    this.newSymbol = '';
    this.newComment = 0;
    this.newMotivo = '';

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


  update(el: Element, comment: number) {
    if (comment == null) { return; }
    // copy and mutate
    //const copy = this.dataSource.data().slice()
    const copy = this.entireDataSource.data().slice()
    el.comment = comment;
    el.dif = el.comment - el.cantref ;
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

      this.addPosicion(
        result.codigo,
        result.name,
        result.symbol,
        result.comment,
        result.motivo);

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

  countChange: number = 0;

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
    private alert: AlertService) {

      console.log("tipoMov= "+ data.tipoMov);
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

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

  }

}
