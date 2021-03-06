import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { Tabla2Component } from './tabla2/tabla2.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { SearchArticuloComponent } from './search-articulo/search-articulo.component';
import { TestComponent } from './test/test.component';
import { TestResolverService } from './test/test-resolver.service';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { 
    path: 'login', 
    component:  LoginComponent
},
  { path: '', component: SeleccionComponent, 
  canActivate: [ AuthGuard ]},
  //{ path: 'tabla/:idPedido', component: TablaComponent},
  { path: 'tabla2/:idPedido/:codCentro', component: Tabla2Component,
  resolve: {
    crisis: TestResolverService
  }},
  { path: 'test/:idPedido/:codCentro', component: TestComponent,
    resolve: {
      crisis: TestResolverService
    }},
  { path: 'articulo/:idPosicion', component: ArticuloComponent},
  { path: 'search-articulo', component: SearchArticuloComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
