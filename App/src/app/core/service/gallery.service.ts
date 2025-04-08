import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'Galleries');
  }

}
