import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Constants} from '../util/constants';
import {User} from '../model/user';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public http: HttpClient) {
  }

  login(user: User) {
    return this.http.post(environment.hostApi + "/api/auths", user)
      .pipe(
        map((resp: any) => {
          localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SESSION_ADMIN,JSON.stringify(resp));
          localStorage.setItem(Constants.LOCAL_STORAGE_KEY.TOKEN_ADMIN, resp["token"]);
          return resp;
        })
      );
  }
}
