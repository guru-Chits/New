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
  roleAccess: any = null;  // Cache role access data here
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
    const accKey = route.data['accKey'];  // Get module key from route data
    const action = route.data['action'] || 'view';  // Get action from route data or default to 'view'

    return this.checkLoginAndAccess(route, accKey, action);
  }

  private checkLoginAndAccess(route: Route | ActivatedRouteSnapshot, accKey?: string, action?: string): Observable<boolean> {
    // Ensure the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // Check if the user is verified
    if (!this.authService.isVerified()) {
      this.router.navigate(['/verify']);  // Redirect to verification page if user is not verified
      return of(false);
    }

    // If we already have the role access data cached, use it
    if (this.roleAccess) {
      return of(this.validateAccess(accKey, action));
    }

    // Fetch access data if not already cached
    const role = sessionStorage.getItem('userRole')?.replace(/"/g, '');  // Clean up stored role string
    if (!role) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // Use forkJoin for parallel requests if necessary
    return this.accessPrivService.getAccessByRole(role).pipe(
      map(response => {
        this.roleAccess = response;  // Cache access data
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

    this.router.navigate(['/login']);  // Redirect to unauthorized page if access denied
    return false;
  }
}

 // import { Injectable } from '@angular/core';
  // import { CanActivate, CanLoad, Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
  // import { Observable, of, forkJoin } from 'rxjs';
  // import { map, catchError } from 'rxjs/operators';
  // import { LoginService } from '../../login/shared/serive/login.service';
  // import { AccessService } from '../../access/service/access.service';
  // import { AuthService } from '../service/auth.service';

  // @Injectable({
  //   providedIn: 'root'
  // })
  // export class AuthGuard implements CanLoad, CanActivate {
  //   accessPrivData: any;
  //   roleAccess: any = null;  // Cache role access data here
  //   roleDetail: any;
  //   moduleAccess: any;

  //   constructor(
  //     private loginService: LoginService,
  //     private router: Router,
  //     private accessPrivService: AccessService,
  //     private authService: AuthService
  //   ) { }

  //   canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //     // You can implement a similar pattern for CanLoad if needed
  //     return this.checkLoginAndAccess(route);
  //   }

  //   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //     const accKey = route.data['accKey'];  // Get module key from route data
  //     const action = route.data['action'] || 'view';  // Get action from route data or default to 'view'

  //     // Check if the user is logged in and has the necessary access
  //     return this.checkLoginAndAccess(route, accKey, action);
  //   }

  //   private checkLoginAndAccess(route: Route | ActivatedRouteSnapshot, accKey?: string, action?: string): Observable<boolean> {
  //     // Ensure the user is logged in
  //     if (!this.authService.isLoggedIn()) {
  //       this.router.navigate(['/login']);
  //       return of(false);
  //     }

  //     // If we already have the role access data cached, use it
  //     if (this.roleAccess) {
  //       return of(this.validateAccess(accKey, action));
  //     }

  //     // Fetch access data if not already cached
  //     const role = sessionStorage.getItem('userRole')?.replace(/"/g, '');  // Clean up stored role string
  //     if (!role) {
  //       this.router.navigate(['/login']);
  //       return of(false);
  //     }

  //     // Use forkJoin for parallel requests if necessary
  //     return this.accessPrivService.getAccessByRole(role).pipe(
  //       map(response => {
  //         this.roleAccess = response;  // Cache access data
  //         return this.validateAccess(accKey, action);
  //       }),
  //       catchError(() => {
  //         this.router.navigate(['/login']);
  //         return of(false);
  //       })
  //     );
  //   }

  //   private validateAccess(accKey?: string, action: string = 'view'): boolean {
  //     const roleDetail = this.roleAccess?.roleAccess?.roleDetails;
  //     const moduleAccess = roleDetail?.find((module: any) => module.moduleName === accKey);
    
  //     if (moduleAccess?.accessType[action]) {
  //       return true;
  //     }
    
  //     this.router.navigate(['/login']);  // Redirect to unauthorized page if access denied
  //     return false;
  //   }


  // }