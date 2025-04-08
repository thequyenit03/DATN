import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment.development';

export class BaseService {
  public routerPrefix: string;

  constructor(public http: HttpClient, public prefix: string) {
    this.routerPrefix = environment.hostApi + '/api/' + prefix;
  }

  get(filter: any) {
    return this.http.get(this.routerPrefix, {params: filter});
  }

  getById(key: any) {
    return this.http.get(this.routerPrefix + "/" + key);
  }

  post(entity: any) {
    return this.http.post(this.routerPrefix, entity);
  }

  put(key: any, entity: any) {
    return this.http.put(this.routerPrefix + "/" + key, entity);
  }

  deleteById(key: any) {
    return this.http.delete(this.routerPrefix + "/" + key);
  }

  getAll() {
    return this.http.get(this.routerPrefix + "/get-all");
  }
}
