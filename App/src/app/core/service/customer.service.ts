import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {User} from '../model/user';
import {environment} from '../../../environments/environment.development';
import {map} from 'rxjs/operators';
import {Constants} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'Customers');
  }

  login(user: User) {
    return this.http.post(environment.hostApi + "/api/customers/login", user)
      .pipe(
        map((resp: any) => {
          localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SESSION, JSON.stringify(resp));
          localStorage.setItem(Constants.LOCAL_STORAGE_KEY.TOKEN, resp["token"]);
          return resp;
        })
      );
  }

  requestOTP(email: string) {
    return this.http.get(this.routerPrefix + "/request-otp", {
      params: {
        email
      }
    })
  }

  confirmOTP(email: string, otp: string) {
    return this.http.get(this.routerPrefix + "/confirm-otp", {
      params: {
        email,
        otp
      }
    })
  }

  forgotPassword(email: string) {
    return this.http.get(this.routerPrefix + "/forgot-password", {
      params: {
        email
      }
    })
  }

  getProfile() {
    return this.http.get(this.routerPrefix + "/get-profile");
  }

  updateProfile(entity: any) {
    return this.http.put(this.routerPrefix + "/update-profile", entity);
  }

  getOrders() {
    return this.http.get(this.routerPrefix + "/get-orders");
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.get(this.routerPrefix + "/change-password", {
      params: {
        oldPassword,
        newPassword
      }
    });
  }

  addWishListProduct(productId: number) {
    return this.http.get(this.routerPrefix + "/add-wishlist-product", {
      params: {
        productId
      }
    });
  }

  removeWishListProduct(productId: number) {
    return this.http.get(this.routerPrefix + "/remove-wishlist-product", {
      params: {
        productId
      }
    });
  }

  getWishListProduct(orderBy: string, price: string, take: number) {
    return this.http.get(this.routerPrefix + "/get-wishlist-product", {
      params: {
        orderBy,
        price,
        take
      }
    });
  }

  getTotalItemWishlist() {
    return this.http.get(this.routerPrefix + "/get-total-wishlist");
  }
}
