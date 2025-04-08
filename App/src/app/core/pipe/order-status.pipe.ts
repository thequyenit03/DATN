import {Pipe, PipeTransform} from '@angular/core';
import {OrderStatus} from '../model/order';

@Pipe({
  name: 'orderStatus',
  standalone: false
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: any): unknown {
    return OrderStatus.toString(value);
  }

}
