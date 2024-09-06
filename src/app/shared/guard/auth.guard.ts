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
    // You can implement a similar pattern for CanLoad if needed
    return this.checkLoginAndAccess(route);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const accKey = route.data['accKey'];  // Get module key from route data
    const action = route.data['action'] || 'view';  // Get action from route data or default to 'view'

    // Check if the user is logged in and has the necessary access
    return this.checkLoginAndAccess(route, accKey, action);
  }

  private checkLoginAndAccess(route: Route | ActivatedRouteSnapshot, accKey?: string, action?: string): Observable<boolean> {
    // Ensure the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.parseUrl('/login');
      return of(false);
    }

    // If we already have the role access data cached, use it
    if (this.roleAccess) {
      return of(this.validateAccess(accKey, action));
    }

    // Fetch access data if not already cached
    const role = sessionStorage.getItem('userRole')?.replace(/"/g, '');  // Clean up stored role string
    if (!role) {
      this.router.parseUrl('/login');
      return of(false);
    }

    // Use forkJoin for parallel requests if necessary
    return this.accessPrivService.getAccessByRole(role).pipe(
      map(response => {
        this.roleAccess = response;  // Cache access data
        return this.validateAccess(accKey, action);
      }),
      catchError(() => {
        this.router.parseUrl('/login');
        return of(false);
      })
    );
  }

  private validateAccess(accKey?: string, action: string = 'view'): boolean {
    if (!this.roleAccess || !accKey) {
      return false;
    }

    const roleDetail = this.roleAccess.roleAccess?.roleDetails;
    const moduleAccess = roleDetail?.find((module: any) => module.moduleName === accKey);
    return moduleAccess ? moduleAccess.accessType[action] === true : false;
  }
}


// import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, CanLoad, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
// import { LoginService } from '../../login/shared/serive/login.service';
// import { AccessService } from '../../access/service/access.service';
// import { catchError, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { AuthService } from '../service/auth.service';
// @Injectable({
//   providedIn: 'root'  // Ensure it's provided at the root level
// })

// export class AuthGuard implements CanLoad, CanActivate {
//   accessPrivData: any;
//   roleAccess:any
//   roleDetail:any
//   moduleAccess
//   constructor(
//     private loginService: LoginService,
//     private router: Router,
//     private accessPrivService: AccessService,
//     private authService:AuthService
//   ) { }
//   canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
//     throw new Error('Method not implemented.');
//   }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//     const accKey = route.data['accKey'];  // The key for the module to check access (e.g., 'Subscriber Management')
//     console.log(route.routeConfig);
    
//     const action = this.getActionFromRoute(route.routeConfig?.path);  // Dynamically fetch action (create, edit, etc.)
//      console.log(action);
     
//     // Check if the user is logged in
//     if (!this.authService.isLoggedIn()) {     
//       this.router.navigate(['/login']);  // Redirect to login if not logged in
//       return false;
//     }

//     // Check access for the specific module and action
//     return this.authService.checkAccess(accKey, action).pipe(
//       map(hasAccess => {
//         if (!hasAccess) {
//           console.log(hasAccess);
//           this.router.navigate(['/login']);  // Redirect to unauthorized page if access denied
//           return false;
//         }
//         return true;  // Allow navigation if access is granted
//       })
//     );
//   }

//   getActionFromRoute(routePath: string | undefined): string {
//     if (routePath?.includes('create')) {
//       return 'create';
//     } else if (routePath?.includes('edit')) {
//       return 'edit';
//     } else if (routePath?.includes('view')) {
//       return 'view';
//     } else if (routePath?.includes('delete')) {
//       return 'delete';
//     }
//     return 'view';  // Default action is 'view'
//   }

//   // Check the access based on the role and action (create, edit, view, delete)
//   checkAccess(accKey: string, action: string): Observable<boolean> {
//     let role = sessionStorage.getItem('userRole');
//     role = role?.replace(/"/g, ''); // Clean up the role string

//     if (!role) {
//       return of(false); // If no role, deny access
//     }

//     return this.accessPrivService.getAccessByRole(role).pipe(
//       map(response => {
//         this.roleAccess=response
//         const roleDetail = this.roleAccess.roleAccess?.roleDetails;
//         const moduleAccess = roleDetail.find((module: any) => module.moduleName === accKey);
//         return moduleAccess ? moduleAccess.accessType[action] === true : false;
//       }),
//       catchError(() => of(false)) // Handle any errors
//     );
//   }  
// }