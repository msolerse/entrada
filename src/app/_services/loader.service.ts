import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class LoaderService {

  private subject = new Subject<boolean>(); 

  constructor() { }

  hide() {
    this.subject.next(false);
  }

  show() {
    this.subject.next(true);
  }

  getStatus():Observable<boolean> {
    return this.subject.asObservable();
  }
  
}
