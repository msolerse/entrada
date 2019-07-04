import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TablaComponent } from './tabla/tabla.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { SeleccionComponent } from './seleccion/seleccion.component';
import {MatInputModule} from '@angular/material/input';
 import {MatCardModule} from '@angular/material/card';
 import {MatTableModule} from '@angular/material/table';
 
 import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


import {  ReactiveFormsModule } from '@angular/forms';
import { SatPopoverModule } from '@ncstate/sat-popover';


import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { AppMaterialModules } from './material.module';


import { Tabla2Component } from './tabla2/tabla2.component';
import { Tabla2Service } from './tabla2.service';
import { HeaderComponent } from './header/header.component';

//import { AuthGuard } from './_guards/auth.guard';

//import { SapService } from './_services/sap.service';
import { AlertService } from './_services/alert.service';
import { CredentialsService } from './_services/credentials.service'
import { httpInterceptorProviders } from './_interceptors';
import { LoaderService } from './_services/loader.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    TablaComponent,
    SeleccionComponent,
    Tabla2Component,
    HeaderComponent,
    InlineEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
     MatCardModule,
     MatInputModule,
     MatButtonModule,
     MatToolbarModule,
    FormsModule,
    MatTableModule,
   MatIconModule,
   SatPopoverModule,
   HttpClientModule
  ],
  providers: [
   // AuthGuard,
   // SapService,
    AlertService,
    httpInterceptorProviders,
   // DatePipe,
    LoaderService,
    CredentialsService,
    Tabla2Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
