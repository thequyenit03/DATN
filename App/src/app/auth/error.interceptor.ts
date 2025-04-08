import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Injectable, NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private ngZone: NgZone, private router: Router) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
          if (err.status === 401) {
            if (location.href.includes('/admin')) {
              this.navigate("/admin/logout");
            } else {
              this.navigate("/dang-xuat");
            }
          } else if (err.status === 302) {
            if (location.href.includes('/admin')) {
              this.navigate("/admin");
            } else {
              this.navigate("/");
            }
          } else if (err.status === 406) {
            if (location.href.includes('/admin')) {
              this.navigate("/admin/logout");
            } else {
              this.navigate("/dang-xuat");
            }
          }
          return throwError(() => err);
        }
      )
    );
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
