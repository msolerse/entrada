import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment';
import { CredentialsService } from '../_services/credentials.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(
        public credentials:CredentialsService
    ){ }

     intercept(req: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>> {
        let newReq;
        if(!req.url.includes(environment.authUrl)){
            let user = this.credentials.user;
            let password = this.credentials.password;
            if (req['url'].includes('zmm_pda')) {
                user =  environment.authUser;
                password =  environment.authPassword;
            }
            newReq = req.clone({
                setHeaders: {
                    'Authorization': "Basic " + btoa(`${user}:${password}`),
                    'Content-Type': 'text/xml',
                    'Accept-Language': 'es-ES'
                }
            });
        }
        else{
            newReq = req;
        }
        return next.handle(newReq);
    } 
} 