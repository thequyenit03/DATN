import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public routerPrefix = environment.hostApi + '/api/reports';

  constructor(public http: HttpClient) {
  }

  getGeneralReport(filter: {}) {
    return this.http.get(this.routerPrefix + "/general", {params: filter});
  }

  getProductReport(filter: {}) {
    return this.http.get(this.routerPrefix + "/product-report", {params: filter});
  }

  getHighlight(date: any) {
    return this.http.get(this.routerPrefix + "/highlight", {
      params: {
        date: moment(new Date(date)).format("YYYY-MM-DDTHH:mm:ss") ?? ""
      }
    });
  }

  getRevenue(date: any) {
    return this.http.get(this.routerPrefix + "/revenue", {
      params: {
        date: moment(new Date(date)).format("YYYY-MM-DDTHH:mm:ss") ?? ""
      }
    });
  }
}
