import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader/loader.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = `https://2factor.in/API/`;

    // Skip 2factor APIs entirely
    if (req.url.startsWith(url)) {
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');
    const cloned = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    // ✅ Show loader only for POST requests
    const showLoader = req.method === 'POST';
    if (showLoader) {
      this.loaderService.show();
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
      finalize(() => {
        if (showLoader) {
          this.loaderService.hide();
        }
      })
    );
  }
}
