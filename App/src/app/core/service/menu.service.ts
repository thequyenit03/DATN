import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'Menus');
  }

  getMainMenu(filter: {}) {
    return this.http.get(this.routerPrefix + "/get-main-menu", {params: filter});
  }

  getSubMenu(filter: {}) {
    return this.http.get(this.routerPrefix + "/get-sub-menu", {params: filter});
  }

  getParentMainMenu() {
    return this.http.get(this.routerPrefix + "/get-parent-main-menu");
  }

  getParentSubMenu() {
    return this.http.get(this.routerPrefix + "/get-parent-sub-menu");
  }

  getMainMenuActive() {
    return this.http.get(this.routerPrefix + "/get-main-menu-active");
  }

  getSubMenuActive() {
    return this.http.get(this.routerPrefix + "/get-sub-menu-active");
  }

  getAllMenuHomePage() {
    return this.http.get(this.routerPrefix + "/get-all-menu-homepage");
  }

  getByType(types: string[]) {
    return this.http.get(this.routerPrefix + "/get-by-type",
      {
        params: {
          types
        }
      });
  }
}
