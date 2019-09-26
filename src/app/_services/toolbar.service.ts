import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ToolbarService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {

    setTimeout(() => {
    this.messageSource.next(message);
     
    });
  }
}
