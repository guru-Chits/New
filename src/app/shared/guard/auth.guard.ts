import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from '../../login/shared/serive/login.service';
import { AccessService } from '../../access/service/access.service';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {
  accessPrivData: any;
  roleAccess: any = null;  
  roleDetail: any;
  moduleAccess: any;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private accessPrivService: AccessService,
    private authService: AuthService
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLoginAndAccess(route);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const accKey = route.data['accKey'];  
    const action = route.data['action'] || 'view';  

    return this.checkLoginAndAccess(route, accKey, action);
  }

  private checkLoginAndAccess(route: Route | ActivatedRouteSnapshot, accKey?: string, action?: string): Observable<boolean> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return of(false);
    }
    // if (!this.authService.isVerified()) {
    //   this.router.navigate(['/verify']); 
    //   return of(false);
    // }
    if (this.roleAccess) {
      return of(this.validateAccess(accKey, action));
    }
    const role = sessionStorage.getItem('userRole')?.replace(/"/g, '');  
    if (!role) {
      this.router.navigate(['/login']);
      return of(false);
    }
    return this.accessPrivService.getAccessByRole(role).pipe(
      map(response => {
        this.roleAccess = response;  
        return this.validateAccess(accKey, action);
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  private validateAccess(accKey?: string, action: string = 'view'): boolean {
    const roleDetail = this.roleAccess?.roleAccess?.roleDetails;
    const moduleAccess = roleDetail?.find((module: any) => module.moduleName === accKey);

    if (moduleAccess?.accessType[action]) {
      return true;
    }

    this.router.navigate(['/login']);  
    return false;
  }
}
