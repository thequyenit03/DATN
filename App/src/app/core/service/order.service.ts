import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'Orders');
  }

  getWIP(filter: {}) {
    return this.http.get(this.routerPrefix + "/get-wip", {params: filter});
  }

  changeStatus(id: number, status: number) {
    return this.http.get(this.routerPrefix + "/change-status", {
      params: {
        id,
        status
      }
    })
  }
}
