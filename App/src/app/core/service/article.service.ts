import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'Articles');
  }

  getHighlight() {
    return this.http.get(this.routerPrefix + "/get-highlight")
  }

  getByMenu(menuAlias: string, take: number) {
    return this.http.get(this.routerPrefix + "/get-by-menu", {
      params: {
        menuAlias,
        take
      }
    })
  }

  getByAlias(alias: string) {
    return this.http.get(this.routerPrefix + "/get-by-alias/" + alias)
  }
}
