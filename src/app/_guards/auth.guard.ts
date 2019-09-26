import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SapService } from '../_services/sap.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private service: SapService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }

  checkLogin(url: string): boolean {
    if(this.service.isLoggedIn) { return true; }

    this.service.redirectUrl = url;

    this.router.navigate(['/login']);
    return false;
  }
}
