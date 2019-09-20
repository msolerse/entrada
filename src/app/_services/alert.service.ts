import { Injectable } from '@angular/core';
//import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Alert, AlertType } from '../_entities/Alert';

@Injectable()
export class AlertService {

  private subject = new Subject<Alert>();
  public validacionOk: boolean;

  sendAlert(mensaje: string, tipo: AlertType) {
    this.subject.next({ mensaje: mensaje, tipo: tipo });
  }

  getAlert(): Observable<Alert> {
    return this.subject.asObservable();
  }

  clearAlert() {
    this.subject.next();
  }

}
