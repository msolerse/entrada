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

@Injectable({ providedIn: 'root' })
export class ArticuloExistValidator implements AsyncValidator {
  constructor(private service: Tabla2Service,
              private sas: SearchArticuloService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
      if (ctrl.value == this.sas.codigo || ctrl.value == '12345') {
       this.sas.codigo = '';
       return of(null); }
      else { 
    return this.service.obtenerArticulo(ctrl.value, this.service.currCentro).pipe(
      map(data => ( (data.codError == 4 ) ? { ArticuloExist: false } : null)),
      catchError(() => null)
    );
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
              private search: SearchArticuloService) {}

  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}

