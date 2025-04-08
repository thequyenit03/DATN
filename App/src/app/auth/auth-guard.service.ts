import {inject, Injectable, NgZone} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {Constants} from '../core/util/constants';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {
  constructor(
    private ngZone: NgZone,
    private router: Router,
  ) {
  }

  canActivate(): boolean {
    let token = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.TOKEN);
    if (location.href.includes('/admin')){
      token = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.TOKEN_ADMIN);
    }
    
    if (token) {
      return true;
    } else {
      if (location.href.includes('/admin')) {
        this.navigate("/admin/dang-nhap");
      } else {
        this.navigate("/dang-nhap");
      }
      return false;
    }
  }

  public navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}

export const AuthGuardService: CanActivateFn = (): boolean => {
  return inject(PermissionsService).canActivate();
}
