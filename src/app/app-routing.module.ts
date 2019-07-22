import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { TablaComponent } from './tabla/tabla.component';
import { Tabla2Component } from './tabla2/tabla2.component';
import { ArticuloComponent } from './articulo/articulo.component';

const routes: Routes = [
  { path: '', component: SeleccionComponent},
  //{ path: 'tabla/:idPedido', component: TablaComponent},
  { path: 'tabla2/:idPedido/:codCentro', component: Tabla2Component},
  { path: 'articulo/:idPosicion', component: ArticuloComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
