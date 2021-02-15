import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material';
import { Unidades } from '../_entities/Unidades';

@Component({
  selector: 'app-tabla2',
  templateUrl: './tabla2.component.html',
  styleUrls: ['./tabla2.component.scss']
})
export class Tabla2Component {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  motivos: Motivo[];

  posiciones: Element[];

  dataSource: MatTableDataSource<Element>;
  //entireDataSource: ExampleDataSource;

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
  totalLength: number;
  // MatPaginator Inputs
  //length = 1000;
  pageSize: number;
  pageIndex: number;
  unidadesart: Unidades[] = [];
  datosArticulo: DatosArticulo;

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
        this.displayedColumns = ['codigo', 'name', 'cantref', 'symbolref', 'comment', 'symbol', 'dif', 'motivo', 'actionsColumn'];

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
        this.displayedColumns = ['codigo', 'name', 'cantref', 'symbolref', 'comment', 'symbol', 'dif', 'actionsColumn'];
      }

      if ((this.idPedido != '0') && (this.service.loadEans)) {

        this.service.eansArticulos = [];
        this.service.obtenerEans('0', this.codCentro, this.service.currPosiciones).subscribe(
          reply => {
            switch (reply.codigo) {
              case 0:

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

              break;

            default:
              console.log("ws datos art prov no ok");
              break;
          }
        });
      }

    });

    if (typeof this.service.pageSize === "undefined") this.service.pageSize = 7;
    if (typeof this.service.pageIndex === "undefined") this.service.pageIndex = 0;

    this.pageSize = this.service.pageSize;
    this.pageIndex = this.service.pageIndex;

    this.route.data
      .subscribe((data: { crisis: Element[] }) => {
        this.posiciones = data.crisis;


        this.dataSource = new MatTableDataSource<Element>(this.posiciones);
        this.dataSource.paginator = this.paginator;
        // this.entireDataSource = new ExampleDataSource(this.posiciones);
        this.totalLength = this.posiciones.length;
        //this.dataSource.paginator = this.paginator;


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
    this.search.codigo = '';
    this.search.nombre = '';

  }

  goSearchArticulo() {
    this.router.navigate(['search-articulo']);
  }

  addPosicion(codigo: string, name: string, symbol: string, comment: number, motivo: string, umb?: string) {

    let maxId: number;
    let elemArt: DatosArticulo;
    let factConv: number;

    if ((this.dataSource.data) && (this.dataSource.data.length !== 0)) {

      maxId = Math.max.apply(Math, this.dataSource.data.map(o => o.id)) + 10;
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

    // umb
    elemArt = this.service.datosArticulos.find(x => +x.codigo === +codigo);

    if (elemArt) {
      umb = elemArt.umb;
      switch (symbol) {
        case 'CJ':
          factConv = elemArt.caja;
          break;
        case 'RET':
          factConv = elemArt.retractil;
          break;
        case 'PAL':
          factConv = elemArt.palet;
          break;
        case 'MAN':
          factConv = elemArt.manto;
          break;
        default:
          factConv = 1;
          break;
      }


    } else {

    }

    this.service.currPosiciones.push({
      id: maxId,
      codigo: codigo,
      name: name,
      symbolref: symbol,
      symbol: symbol,
      cantref: 0,
      comment: comment,
      dif: comment,
      motivo: motivo,
      cantrefUmb: 0,
      umb: umb,
      FactConv: factConv,
      posRefer: '',
      extra: 'X'
    });

    this.posiciones = this.service.currPosiciones;
    this.dataSource.data = this.service.currPosiciones;
    this.totalLength = this.totalLength + 1;
    // this.table.renderRows();
  }


  update(el: Element, comment: string) {
    console.log("update " + el.codigo);
    if (comment == null) { return; }
    // copy and mutate
    const copy = this.dataSource.data.slice();
    el.comment = +comment.split(';')[0];
    el.motivo = comment.split(';')[1];
    let newSymbol = comment.split(';')[2];

    if (el.symbol == newSymbol) { // no se ha cambiado la unida
      this.updateDif(el);
    } else { // se ha cambiado unidad, hay que actulizar el fact. onversión
      el.symbol = newSymbol;
      let elemArt = this.service.datosArticulos.find(x => +x.codigo === +el.codigo);

      if (elemArt) {
        this.datosArticulo = elemArt;
        this.unidadesart = elemArt.unidades;
        this.updateFactConv(el);
        this.updateDif(el);
      }
      else {
        this.service.obtenerArticulo(el.codigo, this.service.currCentro).subscribe(
          reply => {

            switch (reply.datosArticulo.codError) {
              case 0:

                this.datosArticulo = reply.datosArticulo;
                this.unidadesart = reply.datosArticulo.unidades;
                this.updateFactConv(el);
                this.updateDif(el);

                //console.log(  reply.datosArticulo.codError + ' '+reply.datosArticulo.mensajeError );
                break;
              default:

                console.log(reply.datosArticulo.codError + ' ' + reply.datosArticulo.mensajeError);
                this.alert.sendAlert(reply.datosArticulo.mensajeError, AlertType.Error);
                break;
            }
          });
      }
    }
  }

  updateDif(el: Element) {


    el.dif = +((el.comment * el.FactConv) - el.cantrefUmb).toFixed(3);


    // this.dataSource.update(copy);
    // this.dataSource.update(copy);
    this.service.currPosiciones = this.dataSource.data;
    document.getElementById('filtrar').focus();
  }

  updateFactConv(el: Element) {
    switch (el.symbol) {
      case 'CJ':
        el.FactConv = this.datosArticulo.caja;
        break;
      case 'RET':
        el.FactConv = this.datosArticulo.retractil;
        break;
      case 'PAL':
        el.FactConv = this.datosArticulo.palet;
        break;
      case 'MAN':
        el.FactConv = this.datosArticulo.manto;
        break;
      default:
        el.FactConv = 1;
        break;
    }
  }

  readArticle(codigo: string) {

    let elemArt = this.service.datosArticulos.find(x => +x.codigo === +codigo);

    if (elemArt) {
      this.datosArticulo = elemArt;
      this.unidadesart = elemArt.unidades;
    }
    else {
      this.service.obtenerArticulo(codigo, this.service.currCentro).subscribe(
        reply => {

          switch (reply.datosArticulo.codError) {
            case 0:

              this.datosArticulo = reply.datosArticulo;
              this.unidadesart = reply.datosArticulo.unidades;

              //console.log(  reply.datosArticulo.codError + ' '+reply.datosArticulo.mensajeError );
              break;
            default:

              console.log(reply.datosArticulo.codError + ' ' + reply.datosArticulo.mensajeError);
              this.alert.sendAlert(reply.datosArticulo.mensajeError, AlertType.Error);
              break;
          }
        });
    }



  }

  getunidades(el: Element) {
    console.log('get unidades' + el.codigo + ' ' + this.service.currCentro);

    this.unidadesart = [
      { value: el.symbol, viewValue: el.symbol }
    ];

    this.readArticle(el.codigo);
  }

  remove(el: Element) {

    if (el.extra == 'X') {
      const copy = this.dataSource.data.filter(row => row != el);


      this.dataSource.data = copy;
      // this.entireDataSource.update(copy);
      this.service.currPosiciones = this.dataSource.data;
      this.totalLength = this.totalLength - 1;
    }

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
        elem = this.dataSource.data.find(x => x.codigo === codArt);
      } else { // Es un código de articulo
        elem = this.dataSource.data.find(x => x.codigo === ean);
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

    this.dataSource.filter = value.trim().toLowerCase();

  }

  searchNewEan(ean: string, codCentro: string, f2?: any) {

    let dialogRef;
    let codArt: string;
    let dialogData: DialogData;
    this.service.obtenerArticulo(ean, this.codCentro).subscribe(
      reply => {

        switch (reply.datosArticulo.codError) {
          case 0:
            this.addRow(true, +reply.datosArticulo.codigo + '', f2, true, reply.datosArticulo.descripcion);

            break;
          default:

            this.alert.sendAlert('Ean no encontrado', AlertType.Error);
            break;
        }
      });
  }

  goBack() {
    this.alert.validacionOk = false;
    this.router.navigate(['']);
  }


  changePage(e) {
    console.log('pageSize=' + e.pageSize);
    this.service.pageSize = e.pageSize;
    this.pageSize = e.pagesize;
    this.service.pageIndex = e.pageIndex;
    this.pageIndex = e.pageIndex;
    /*  let firstCut = e.pageIndex * e.pageSize;
     let secondCut = firstCut + e.pageSize;
     this.dataSource =new ExampleDataSource( this.posiciones.slice(firstCut, secondCut)); */

  }

  goValidar() {

    let messageShowed: string = '';
    let tipoShowed: string = 'W';

    this.service.validarEntrada(this.dataSource.data).subscribe(data => {

      data.returnMessages.forEach(ret => {

        messageShowed += ret.mensaje + '<br><br>';

      });


      if (data.returnMessages.some(el => (el.tipo === 'S' || el.tipo === 'I'))) { tipoShowed = 'S' }
      else if (data.returnMessages.some(el => el.tipo === 'E')) { tipoShowed = 'E' }
      else { tipoShowed = 'W' };

      switch (tipoShowed) {
        case 'E':
          this.alert.sendAlert(messageShowed, AlertType.Error);
          break;
        case 'S':
          this.alert.validacionOk = true;
          this.alert.sendAlert(messageShowed, AlertType.Success);
          break;
        default:
          this.alert.sendAlert(messageShowed, AlertType.Warning);
          break;
      }


      if (this.alert.validacionOk) {
        this.service.currPosiciones = [];
        //this.service.eansArticulos = [];
        this.service.currAlbaran = '';
        this.service.currPedido = '';
        this.service.currProveedor = '';
        this.service.tiped = '';
        this.service.provCabeceraWs = '';
        this.service.tipoDocRefer = '';
        this.router.navigate(['']);
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

  unis: Uni[];
  /*= [
    { value: 'UN', viewValue: 'UN' },
    { value: 'CJ', viewValue: 'CJ' },
    { value: 'RET', viewValue: 'RET' },
    { value: 'PAL', viewValue: 'PAL' },
    { value: 'MAN', viewValue: 'MAN' },
  ];*/

  focusCantidad: boolean;

  ngOnInit() {

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

    if (this.data.symbol == '' || typeof (this.data.symbol) == "undefined")
      this.data.symbol = 'CJ';
    this.motivos = this.service.motivosMov;
    this.unis = this.service.unidades;
    //this.ads.changeMessage('');
    this.ads.currentMessage.subscribe(message =>
      this.data.name = message);
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

}
