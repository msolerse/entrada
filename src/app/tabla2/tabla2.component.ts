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
import { Ean } from '../_entities/Ean';
//import { element } from '@angular/core/src/render3';


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

  displayedColumns: string[];
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
  filtrarText: string = '';

  unis: Uni[] = [
    { value: 'UN', viewValue: 'UN' },
    { value: 'CJ', viewValue: 'CJ' },
    { value: 'RET', viewValue: 'RET' },
    { value: 'PAL', viewValue: 'PAL' },
  ];

  constructor(private route: ActivatedRoute,
    private router: Router, private service: Tabla2Service,
    private alert: AlertService, public dialog: MatDialog,
    private search: SearchArticuloService,
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


      if (this.tipoMov == '002') { // distribucion plataforma, obtener motivos
        this.displayedColumns = ['codigo', 'name', 'symbol', 'cantref', 'comment', 'dif', 'motivo', 'actionsColumn'];

        if (this.service.motivosMov.length != 0) {
          this.motivos = this.service.motivosMov;
        }
        else {
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
      else if (this.idPedido == '0'
      ) { this.displayedColumns = ['codigo', 'name', 'symbol', 'comment', 'actionsColumn']; }
      else {
        this.displayedColumns = ['codigo', 'name', 'symbol', 'cantref', 'comment', 'dif', 'actionsColumn'];
      }

      if (this.idPedido != '0') {
        this.service.eansArticulos = [];
        this.service.obtenerEans('0', this.codCentro, this.service.currPosiciones).subscribe(
          reply => {
            switch (reply.codigo) {
              case 0:
                console.log("Eans ok");
                console.log(JSON.stringify(this.service.eansArticulos));
                break;

              default:
                console.log("Eans no ok");
                break;
            }
          });
      }


      if (this.codProv && (this.codProv !== this.service.currProveedor)) {
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

        if (this.idPedido == '0' && this.posiciones.length == 0) {
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

    if (!!this.albaran && this.albaran !== 'undefined') { this.showAlbaran = true; }
    else { this.showAlbaran = false; }

    document.getElementById('filtrar').focus();

  }

  public changeCodigo() {


    this.service.obtenerArticulo(this.newCodigo, this.codCentro).subscribe(reply => {
      switch (reply.codError) {
        case 0:
          //this.alert.sendAlert(reply.mensaje, AlertType.Success);
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
    console.log("this.newSymbol=" + this.newSymbol);

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
    // si es un ean , convertir a código interno
    if (codigo.length >= 8) {
      let elemEan: Ean;

      elemEan = this.service.eansArticulos.find(x => x.ean === codigo);

      if (elemEan) {
        codigo = elemEan.codigo;
      }
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
    console.log('update comment = ' + comment);
    el.comment = +comment.split(';')[0];
    el.dif = el.comment - el.cantref;
    el.motivo = comment.split(';')[1];
    // this.dataSource.update(copy);
    this.entireDataSource.update(copy);
    this.service.currPosiciones = this.entireDataSource.data();
    document.getElementById('filtrar').focus();
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

  // upsert: if exists -> update, else -> insert
  addRow(search: boolean, ean: string, f2?: any, okBack?: boolean, desc?: string): void {

    if ((search) && (!(ean))) return;

    let elem: Element;
    let elemEan: Ean;
    let dialogData: DialogData;
    let dialogRef;
    let codArt: string;

    if (ean) {

      if (ean.length >= 8) {
        //Es un ean 
        // busqueda Ean en caché
        elemEan = this.service.eansArticulos.find(x => x.ean === ean);
        if (!(elemEan)) {
          this.searchNewEan(ean, this.codCentro, f2);
          return;
        }

        codArt = elemEan.codigo;
        elem = this.entireDataSource.data().find(x => x.codigo === codArt);
      } else { // Es un código de articulo
        elem = this.entireDataSource.data().find(x => x.codigo === ean);
      }

      if (!(elem)) {
        if (!(okBack)) {
          this.searchNewEan(ean, this.codCentro, f2);
          return;
        }
        else { // alta por scaneo
          dialogData = {
            codigo: ean, name: desc,
            symbol: 'CJ', tipoMov: this.tipoMov, codCentro: this.codCentro,
            comment: 0, motivo: '', cancel: false, title: 'Añadir Posición'
          };
          this.service.eanFiltered = true;
          this.ads.changeMessage(dialogData.name);
          dialogRef = this.dialog.open(AddRowDialog, {
            disableClose: true,
            width: '400px',
            data: {
              codigo: dialogData.codigo, name: dialogData.name,
              symbol: dialogData.symbol, comment: dialogData.comment,
              tipoMov: dialogData.tipoMov, codCentro: dialogData.codCentro,
              motivo: dialogData.motivo, title: dialogData.title
            }
          });
        }
      }
      else {
        // console.log("trobat ="+ JSON.stringify( elem));
        dialogData = {
          codigo: elem.codigo, name: elem.name,
          symbol: elem.symbol, tipoMov: this.tipoMov, codCentro: this.codCentro,
          comment: elem.comment, motivo: elem.motivo, cancel: false, title: 'Modificar Posición'
        }
        this.service.eanFiltered = true;
        this.ads.changeMessage(dialogData.name);
        dialogRef = this.dialog.open(AddRowDialog, {
          disableClose: true,
          width: '400px',
          data: {
            codigo: dialogData.codigo, name: dialogData.name,
            symbol: dialogData.symbol, comment: dialogData.comment,
            tipoMov: dialogData.tipoMov, codCentro: dialogData.codCentro,
            motivo: dialogData.motivo, title: dialogData.title
          }
        });
      }
    } else { // botón alta de  posición

      this.ads.changeMessage('');
      dialogRef = this.dialog.open(AddRowDialog, {
        disableClose: true,
        width: '400px',
        data: { tipoMov: this.tipoMov, codCentro: this.codCentro, title: 'Añadir Posición' }
      });
    }


    dialogRef.afterClosed().subscribe(result => {
      if (f2)
        f2.form.reset();

      this.doFilter('');

      if (result) {
        if (elem)
          this.update(elem, result.comment + ';' + result.motivo);
        else
          this.addPosicion(
            result.codigo,
            result.name,
            result.symbol,
            result.comment,
            result.motivo);
      }

    });


  }

  public doFilter = (value: string) => {
    // console.log (this.entireDataSource.data());
    this.dataSource.update(this.entireDataSource.data().filter(row => row));
    const copy = this.dataSource.data().filter(row => row.name.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()) ||
      row.codigo.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()));
    this.dataSource.update(copy);
  }

  searchNewEan(ean: string, codCentro: string, f2?: any) {

    let dialogRef;
    let codArt: string;
    let dialogData: DialogData;
    this.service.obtenerArticulo(ean, this.codCentro).subscribe(
      reply => {
        switch (reply.codError) {
          case 0:
            this.addRow(true, +reply.codigo + '', f2, true, reply.descripcion);
            // console.log("trobat ="+ JSON.stringify( elem));
            break;
          default:

            this.alert.sendAlert('Ean no encontrado', AlertType.Error);
            break;
        }
      });
  }

  goBack() {
    this.router.navigate(['']);
  }

  goValidar() {
    console.log("Grabando!");
    this.service.validarEntrada().subscribe(data => {

      switch (+data.codigo) {
        case 0:

          this.alert.sendAlert('Validacón efectuada correctamente.', AlertType.Success);
          break;
        default:
          this.alert.sendAlert('Error en el proceso de validación.', AlertType.Error);
          break;
      }
    });
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
  title: string;
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
export class AddRowDialog implements OnInit {

  motivos: Motivo[];
  title: string;

  unis: Uni[] = [
    { value: 'UN', viewValue: 'UN' },
    { value: 'CJ', viewValue: 'CJ' },
    { value: 'RET', viewValue: 'RET' },
    { value: 'PAL', viewValue: 'PAL' },
  ];

  focusCantidad: boolean;

  ngOnInit() {
    console.log("data.codigo=" + this.data.codigo);
    this.title = this.data.title;
    if (this.data.codigo) {
      //     this.title = "Modificar Posición"

      document.getElementById('cantidad').focus();
      this.focusCantidad = true;
    }
    else {
      //      this.title = "Añadir Posición";
      // document.getElementById('codigo').focus();
    }


  }

  constructor(
    public dialogRef: MatDialogRef<AddRowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: Tabla2Service,
    private alert: AlertService,
    private ads: ArticuloDescService) {

    console.log("tipoMov= " + data.tipoMov);
    //this.data.symbol = 'CJ';
    this.motivos = this.service.motivosMov;
    //this.ads.changeMessage('');
    this.ads.currentMessage.subscribe(message =>
      this.data.name = message);
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

}
