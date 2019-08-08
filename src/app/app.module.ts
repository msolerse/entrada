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
 import { MatProgressBarModule } from '@angular/material/progress-bar';
 

 import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


import {  ReactiveFormsModule } from '@angular/forms';
import { SatPopoverModule } from '@ncstate/sat-popover';


import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { AppMaterialModules } from './material.module';


import { Tabla2Component } from './tabla2/tabla2.component';
import { LoaderComponent } from './loader/loader.component';
import { Tabla2Service } from './tabla2.service';
import { HeaderComponent } from './header/header.component';

//import { AuthGuard } from './_guards/auth.guard';

//import { SapService } from './_services/sap.service';
import { AlertService } from './_services/alert.service';
import { CredentialsService } from './_services/credentials.service'
import { httpInterceptorProviders } from './_interceptors';
import { LoaderService } from './_services/loader.service';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {AddRowDialog} from './tabla2/tabla2.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";

import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDatepickerModule } from "@angular/material/datepicker";

import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { SearchArticuloComponent } from './search-articulo/search-articulo.component';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    AppComponent,
    TablaComponent,
    SeleccionComponent,
    Tabla2Component,
    LoaderComponent,
    HeaderComponent,
    InlineEditComponent,
    AddRowDialog,
    ArticuloComponent,
    SearchArticuloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSidenavModule, 
    MatListModule,
    MatSelectModule,
    MatProgressBarModule,
     MatCardModule,
     MatInputModule,
     MatButtonModule,
     MatToolbarModule,
    FormsModule,
    MatTableModule,
   MatIconModule,
   MatDialogModule,
   SatPopoverModule,
   HttpClientModule,
   FlexLayoutModule,
   Ng2SearchPipeModule
  ],
entryComponents: [AddRowDialog],
  providers: [
   // AuthGuard,
   // SapService,
    AlertService,
   httpInterceptorProviders,
   // DatePipe,
    LoaderService,
    CredentialsService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
