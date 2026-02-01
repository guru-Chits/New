import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  catchError,
  finalize,
  filter,
  switchMap,
  take
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader/loader.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipUrl = `https://2factor.in/API/`;

    if (req.url.startsWith(skipUrl)) {
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');

    const cloned = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    const showLoader = req.method === 'POST';
    if (showLoader) this.loaderService.show();

    return next.handle(cloned).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handle401Error(cloned, next);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        if (showLoader) this.loaderService.hide();
      })
    );
  }

  /** Handle 401: Refresh token and retry request */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logoutAndRedirect();
      return throwError(() => 'No refresh token found');
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refresh().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;

          const newAccessToken = res.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(
            request.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` }
            })
          );
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.logoutAndRedirect();
          return throwError(() => err);
        })
      );
    }

    // queue requests while token is refreshing
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token =>
        next.handle(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          })
        )
      )
    );
  }

  private logoutAndRedirect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
