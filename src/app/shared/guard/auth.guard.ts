import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, CanLoad, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { LoginService } from '../../login/shared/serive/login.service';
import { AccessService } from '../../access/service/access.service';
import { catchError, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
@Injectable({
  providedIn: 'root'  // Ensure it's provided at the root level
})

export class AuthGuard implements CanLoad, CanActivate {
  accessPrivData: any;
  roleAccess:any
  roleDetail:any
  moduleAccess
  constructor(
    private loginService: LoginService,
    private router: Router,
    private accessPrivService: AccessService,
    private authService:AuthService
  ) { }
  canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    throw new Error('Method not implemented.');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const accKey = route.data['accKey'];  // The key for the module to check access (e.g., 'Subscriber Management')
    console.log(route.routeConfig);
    
    const action = this.getActionFromRoute(route.routeConfig?.path);  // Dynamically fetch action (create, edit, etc.)
     console.log(action);
     
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {     
      this.router.navigate(['/login']);  // Redirect to login if not logged in
      return false;
    }

    // Check access for the specific module and action
    return this.authService.checkAccess(accKey, action).pipe(
      map(hasAccess => {
        if (!hasAccess) {
          console.log(hasAccess);
          this.router.navigate(['/login']);  // Redirect to unauthorized page if access denied
          return false;
        }
        return true;  // Allow navigation if access is granted
      })
    );
  }

  getActionFromRoute(routePath: string | undefined): string {
    if (routePath?.includes('create')) {
      return 'create';
    } else if (routePath?.includes('edit')) {
      return 'edit';
    } else if (routePath?.includes('view')) {
      return 'view';
    } else if (routePath?.includes('delete')) {
      return 'delete';
    }
    return 'view';  // Default action is 'view'
  }

  // Check the access based on the role and action (create, edit, view, delete)
  checkAccess(accKey: string, action: string): Observable<boolean> {
    let role = sessionStorage.getItem('userRole');
    role = role?.replace(/"/g, ''); // Clean up the role string

    if (!role) {
      return of(false); // If no role, deny access
    }

    return this.accessPrivService.getAccessByRole(role).pipe(
      map(response => {
        this.roleAccess=response
        const roleDetail = this.roleAccess.roleAccess?.roleDetails;
        const moduleAccess = roleDetail.find((module: any) => module.moduleName === accKey);
        return moduleAccess ? moduleAccess.accessType[action] === true : false;
      }),
      catchError(() => of(false)) // Handle any errors
    );
  }



  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> | Promise<boolean> | boolean {
  //   const accessKey = route.data.accKey;
  //   let role = sessionStorage.getItem('userRole');
  //   role = role?.replace(/"/g, ''); // Clean up the role string
  
  //   return new Observable<boolean>((observer) => {
  //     // Fetch the role access details from your service
  //     this.accessPrivService.getAccessByRole(role).subscribe(
  //       (response) => {
  //         this.roleAccess = response;
  //         this.roleDetail = this.roleAccess.roleAccess.roleDetails;
  
  //         if (accessKey) {
  //           const hasAccess = this.roleDetail.some((roleDetail) => {
  //             return roleDetail.moduleName === accessKey && roleDetail.accessType.view;
  //           });
  
  //           if (!hasAccess) {
  //             this.router.navigate(['/login']); // Redirect if no access
  //             observer.next(false); // Deny access
  //             observer.complete();
  //           } else {
  //             observer.next(true); // Allow access
  //             observer.complete();
  //           }
  //         } else {
  //           observer.next(true); // If no accessKey, allow access by default
  //           observer.complete();
  //         }
  //       },
  //       (error) => {
  //         // Handle error (you can redirect to login or error page here)
  //         this.router.navigate(['/login']);
  //         observer.next(false);
  //         observer.complete();
  //       }
  //     );
  //   });
  // }
  
}