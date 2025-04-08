import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'Reviews');
  }

  getByOrder(orderDetailId: number) {
    return this.http.get(this.routerPrefix + "/get-by-order/" + orderDetailId);
  }

  updateStatus(id: number, status: number) {
    return this.http.get(this.routerPrefix + "/update-status/" + id, {
      params: {
        status
      }
    });
  }
}
