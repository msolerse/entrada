import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Tabla2Service } from '../tabla2.service';
import { SearchArticuloService } from '../search-articulo/search-articulo.service';
import { Ean } from '../_entities/Ean';
import { DatosArticuloProv } from '../_entities/DatosArticuloProv';
import { ArticuloDescService } from './articuloDesc.service';

@Injectable({ providedIn: 'root' })
export class ArticuloExistValidator implements AsyncValidator {
  constructor(private service: Tabla2Service,
    private sas: SearchArticuloService,
    private ads: ArticuloDescService) { }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (this.service.currTipoMov == '001') {

      let datosArt: DatosArticuloProv;

      datosArt = this.service.currDatosArticuloProv.find(x => x.codigo === ctrl.value);

      let err: ValidationErrors;

      if (datosArt) {

        this.ads.changeMessage(datosArt.nombre);
        return of(null);
      }
      else {
        let elemEan: Ean;

        elemEan = this.service.eansArticulos.find(x => x.ean === ctrl.value);

        if (elemEan) {
          datosArt = this.service.currDatosArticuloProv.find(x => x.codigo === elemEan.codigo);
          this.ads.changeMessage(datosArt.nombre);
          return of(null);
        }
        else {
          err = { ArticuloExist: false };
          return of(err);
        }
      }

    }
    else {
      if (ctrl.value == this.sas.codigo) {
        this.sas.codigo = '';
        return of(null);
      }
      else if (this.service.eanFiltered) {
        this.service.eanFiltered = false;
        return of(null);
      }
      else {
        //console.log(" obtener articulo proveedor "+  this.service.currProveedor );
        return this.service.obtenerArticulo(ctrl.value, this.service.currCentro ).pipe(
          map(data => ((data.codError == 4) ? { ArticuloExist: false } : null)),
          catchError(() => null)
        );
      }
    }
  }
}

@Directive({
  selector: '[appArticuloExist]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => ArticuloExistValidator),
      multi: true
    }
  ]
})
export class ArticuloExistValidatorDirective {
  constructor(private validator: ArticuloExistValidator,
    private search: SearchArticuloService) { }

  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}

