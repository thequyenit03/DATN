import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Order} from '../../../../core/model/order';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-order-detail',
  imports: [ShareModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  @Input() order!: Order;
  @Output() onChangeStatus = new EventEmitter<number>();

  visible = false;

  get getTotalAmount(): number {
    let total: number = 0;
    if (this.order)
      this.order.orderDetails.forEach(x => {
        total += x.qty * x.productDiscountPrice;
      })

    return total;
  }

  setForm(order: Order | any) {
    this.order = order;
  }

  close() {
    this.visible = false;
  }

  updateStatus(status: number) {
    this.onChangeStatus.emit(status);
  }
}
