import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Tabla2Service } from '../tabla2.service';
import { Element } from '../Element';


@Injectable({
  providedIn: 'root'
})
export class TestResolverService implements Resolve<Element[]> {

  emptyPosiciones: Element[] = [];

  constructor(private ts: Tabla2Service, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Element[]> | Observable<never> {
    // tslint:disable-next-line: prefer-const
    let idPedido = route.paramMap.get('idPedido');
    // tslint:disable-next-line: prefer-const
    let codCentro = route.paramMap.get('codCentro');
    console.log( "Resolver cod centro="+codCentro);
    let albaran = route.paramMap.get('albaran');
    let tipoDoc = route.paramMap.get('tipoDoc');
    let tipoMov = route.paramMap.get('tipoMov');
   
    console.log( 'this.ts.currPedido= ' +  this.ts.currPedido);
    console.log( 'idPedido= ' +  idPedido);
 
    if (idPedido != '0' && idPedido == this.ts.currPedido) {
       console.log( 'pedidos iguals');
       this.ts.loadEans = false;
      return of(this.ts.currPosiciones);
    }  else {
      if (idPedido != '0') {
        console.log( 'crida a obtener posiciones' );
        this.ts.loadEans = true;
        return this.ts.obtenerPosiciones(idPedido, albaran, codCentro,  tipoDoc, tipoMov).pipe(
          take(1),
          mergeMap(posiciones => {
            if (posiciones.length > 0) {
              console.log('posiciones.length=' + posiciones.length);
              this.ts.currAlbaran = albaran;
              return of(posiciones);
            } else { // id not found
              //  this.router.navigate(['/seleccion']);
              return EMPTY;
            }
          })
        );
      } else {   if ( albaran == this.ts.currAlbaran) {
        console.log( 'this.ts.currAlbaran= ' +  this.ts.currAlbaran);
        console.log( 'albaran= ' +  albaran);
        console.log('albaran igual , agafem posicions en memoria');
        this.ts.loadEans = false;

        return of(this.ts.currPosiciones);
      } else {
        console.log('albaran diferent , inicialitzem posicions');

        this.ts.loadEans = false;
        this.ts.currAlbaran = albaran;
        this.ts.currPedido = idPedido;
        this.emptyPosiciones.length = 0;
        this.ts.currPosiciones = this.emptyPosiciones;
        console.log('this.emptyPosiciones' + JSON.stringify(this.emptyPosiciones));
        return of(this.emptyPosiciones);
      }

      }
    }
  }
}

