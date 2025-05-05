import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import {environment} from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService {
  constructor(http: HttpClient,
           
  ) {
    super(http, 'Payment');
  }
  private urlApi = environment.hostApi+'/api';

  createPaymentLink(totalAmount: number): Observable<string> {
    
    return this.http.post<string>(
      `${this.routerPrefix}`,
      { totalAmount: totalAmount }, // Gửi totalAmount từ client
      { responseType: 'text' as 'json' }          
  );
    
  }
  verifyPayment(params: any): Observable<string> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, params[key]);
    });
    return this.http.get(`${this.urlApi}/payment-return`, {
      params: httpParams,
      responseType: 'text'
    });
  }
}
