import { Component, Input, Optional, Host,  OnChanges, SimpleChange  } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { filter } from 'rxjs/operators';
import { Motivo } from '../_entities/Motivo';
import { Tabla2Service } from '../tabla2.service';


@Component({
  selector: 'inline-edit',
  styleUrls: ['inline-edit.component.scss'],
  template: `
    <form (ngSubmit)="onSubmit()" novalidate
    #f="ngForm">
      <div class="mat-subheading-2">Modificar cantidad</div>

      <mat-form-field>
        <input matInput maxLength="10" name="comment" [(ngModel)]="comment">
        <mat-hint align="end">{{comment?.length || 0}}/10</mat-hint>
      </mat-form-field>

      <div *ngIf="tipoMov == '002'" >
        <mat-form-field   class="example-full-width">
        <mat-label>Motivo</mat-label>
        <mat-select id="motivo" name="motivo" [(ngModel)]="motivo" required>
          <mat-option *ngFor="let motivo of motivos" [value]="motivo.value">
            {{motivo.viewValue | titlecase}}
          </mat-option>
        </mat-select>
        </mat-form-field>
     </div>

      <div class="actions">
        <button mat-button type="button" color="primary" (click)="onCancel()">CANCELAR</button>
        <button mat-button type="submit" color="primary" [disabled]="f.invalid" >GUARDAR</button>
      </div>
    </form>
  `
})
export class InlineEditComponent {



  /** Overrides the comment and provides a reset value when changes are cancelled. */
  
  @Input()
  get value(): string { return this._value; }
  set value(x: string) {
    this.comment = this._value = x;
  }
  @Input()
  get value2(): string { return this._value2; }
  set value2(x: string) {
    this.motivo = this._value2 = x;
  }

  private _value = '';
  private _value2 = '';
  

  /** Form model for the input. */
comment = '';
motivo = '';

tipoMov: string;

motivos: Motivo[];

constructor( private ts: Tabla2Service,
             @Optional() @Host() public popover: SatPopover) { }

ngOnInit() {
    // subscribe to cancellations and reset form value
    this.motivos = this.ts.motivosMov;
    this.tipoMov = this.ts.currTipoMov;
    if (this.popover) {
      this.popover.closed.pipe(filter(val => val == null))
        .subscribe(() => this.comment = this.value || '');
    }
  }

onSubmit() {
    if (this.popover) {
      this.popover.close(this.comment + ';' + this.motivo);
    }
  }

onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}
