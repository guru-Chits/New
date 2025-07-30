import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader/loader.service';

@Injectable()

export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private loaderService: LoaderService ) { }
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = `https://2factor.in/API/`;

    if (req.url.startsWith(url)) {
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');
    const cloned = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    this.loaderService.show(); // 🔸 Show loader before request

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // Optional: handle auth errors here
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.hide(); // 🔸 Hide loader after request completes
      })
    );
  }
}
