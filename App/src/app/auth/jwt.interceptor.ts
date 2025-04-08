import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from '../core/util/constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.TOKEN);
    if (location.href.includes('/admin')){
      token = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.TOKEN_ADMIN);
    }
    
    let header: any = {};
    if (token) {
      header["Authorization"] = token;
    }
    request = request.clone({
      setHeaders: header,
    });
    return next.handle(request);
  }
}
