/*import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HeadersInterceptor } from "./headers.interceptor";
//import { LoaderInterceptor } from "./loader.interceptor";

export const httpInterceptorProviders = [
   // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true }
];*/