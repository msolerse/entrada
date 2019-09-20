import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../_services/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { Alert, AlertType } from '../_entities/Alert';
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  alertas: Alert[] = [];
  subscription: Subscription;

  constructor(
    private service: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.service.getAlert().subscribe(alerta => {
      /*this.alertas.push(alerta);
      if(this.alertas.length > 2)
        this.alertas.splice(0, 1);*/
      this.alertas = [];
      this.alertas.push(alerta);
    });

    /* this.subscription =  this.service.getAlert().subscribe( 
      () =>   this.alertas = []) */;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCss(alerta: Alert): string {
    if(!alert) return;
    
    switch (alerta.tipo) {
      case AlertType.Error:
        return 'alert-danger';
      case AlertType.Info:
        return 'alert-info';
      case AlertType.Success:
        return 'alert-success';
      case AlertType.Warning:
        return 'alert-warning';
      default:
        return 'alert-primary';
    }
  }

  removeAlerta(alerta: Alert) {
    this.alertas = this.alertas.filter(a => a !== alerta);
  }

}
