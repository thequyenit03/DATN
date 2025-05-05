import {Component} from '@angular/core';
import {ShareModule} from '../../../share.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/service/order.service';

@Component({
  selector: 'app-order-successful',
  imports: [ShareModule],
  templateUrl: './order-successful.component.html',
  styleUrls: ['./order-successful.component.css']
})
export class OrderSuccessfulComponent {
 
}
