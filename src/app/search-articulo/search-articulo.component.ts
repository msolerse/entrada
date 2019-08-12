import { Component, OnInit } from '@angular/core';

import {MatTableDataSource} from '@angular/material/table';
import {DatosArticuloProv} from '../_entities/DatosArticuloProv';
import { SeleccionService } from '../seleccion/seleccion.service';
import { AlertService } from '../_services/alert.service';



@Component({
  selector: 'app-search-articulo',
  templateUrl: './search-articulo.component.html',
  styleUrls: ['./search-articulo.component.scss']
})
export class SearchArticuloComponent implements OnInit {

  title = 'Articulos del proveedor';
  dataSource: MatTableDataSource<DatosArticuloProv>;

  displayedColumns: string[] = ['codigo', 'nombre', 'ubicacion', 'codProveedor', 'descatalogado',
  'stockCompras', 'stockMaximo', 'stockMinimo'];
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private service: SeleccionService,
             private alert: AlertService) { }

  ngOnInit() {

    if (this.service.currDatosArticuloProv && this.service.currDatosArticuloProv.length )
     this.dataSource = new MatTableDataSource(this.service.currDatosArticuloProv);
    

  }

  getRecord(row) {
    console.log("man clicakt"+ row);
  }

}
