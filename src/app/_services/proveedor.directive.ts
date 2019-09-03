import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { SeleccionService } from '../seleccion/seleccion.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProveedorExistValidator implements AsyncValidator {
  constructor(private service: SeleccionService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (ctrl.value == this.service.currProveedor)
     return of(null)
    else 
    return this.service.obtenerProveedor(ctrl.value, this.service.currDatosCentro.codigo).pipe(
      map(data => ( (data.codError == 4 ) ? { proveedorExist: false } : null)),
      catchError(() => null)
    );
  }
}

@Directive({
  selector: '[appProveedorExist]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => ProveedorExistValidator),
      multi: true
    }
  ]
})
export class ProveedorExistValidatorDirective {
  constructor(private validator: ProveedorExistValidator) {}

  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}

