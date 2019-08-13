import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { DatosArticuloProv } from '../_entities/DatosArticuloProv';
import { SeleccionService } from '../seleccion/seleccion.service';
import { AlertService } from '../_services/alert.service';
import { SearchArticuloService } from './search-articulo.service';
import { Location } from '@angular/common';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-articulo',
  templateUrl: './search-articulo.component.html',
  styleUrls: ['./search-articulo.component.scss']
})
export class SearchArticuloComponent implements OnInit {

  title = 'Articulos del proveedor';
  dataSource: MatTableDataSource<DatosArticuloProv>;

  currentScreenWidth: string = '';
  flexMediaWatcher: Subscription;

  displayedColumns: string[];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private service: SeleccionService,
    private alert: AlertService,
    private search: SearchArticuloService,
    private location: Location,
    private mediaObserver: MediaObserver) {
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    }); // Be sure to unsubscribe from this in onDestroy()!
  }

  ngOnInit() {
    
    if (this.service.currDatosArticuloProv && this.service.currDatosArticuloProv.length)
      this.dataSource = new MatTableDataSource(this.service.currDatosArticuloProv);


  }

  setupTable() {

    this.displayedColumns = ['codigo', 'nombre', 'ubicacion', 'codProveedor', 'descatalogado',
    'stockCompras', 'stockMaximo', 'stockMinimo'];
  
    if (this.currentScreenWidth === 'xs') { // 
        this.displayedColumns = ['codigo', 'nombre'];
    }
};

  getRecord(row) {
    //console.log("man clickat"+ row.codigo);
    this.search.codigo = row.codigo;
    this.search.nombre = row.nombre;
    this.location.back();
  }

}
