import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpUserEvent, HttpEvent } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { nextTick } from 'q';
import { LoaderService } from '../_services/loader.service';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/finally';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(
        private loader: LoaderService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("loader es dispara");
        this.loader.show();

        //return next.handle(req).finally(() => {
         //   this.loader.hide();

         return next.handle(req).delay(1000).finally(() => {
            this.loader.hide();
        });
    
    }

}