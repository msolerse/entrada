import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Tabla2Service } from '../tabla2.service';
import { Element } from '../Element';


@Injectable({
  providedIn: 'root'
})
export class TestResolverService implements Resolve<Element[]> {


  constructor(private ts: Tabla2Service, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Element[]> | Observable<never> {
    // tslint:disable-next-line: prefer-const
    let idPedido = route.paramMap.get('idPedido');
    // tslint:disable-next-line: prefer-const
    let codCentro = route.paramMap.get('codcentro');
    let albaran = route.paramMap.get('albaran');

    return this.ts.obtenerPosiciones(idPedido, codCentro, albaran).pipe(
      take(1),
      mergeMap( posiciones => {
        if ( posiciones.length > 0 )  {
          console.log("posiciones.length="+ posiciones.length );
          return of(posiciones);
        } else { // id not found
          //this.router.navigate(['/seleccion']);
          return EMPTY;
        }
      })
    );
  }
}