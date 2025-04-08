import {Component} from '@angular/core';
import {Customer} from '../../../../core/model/customer';
import {Order} from '../../../../core/model/order';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-customer-detail',
  imports: [ShareModule],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent {
  customer!: Customer;
  visible = false;
  isVisibleModal = false;
  orderSelected!: Order;

  get getTotalAmount(): number {
    let total: number = 0;
    if (this.orderSelected)
      this.orderSelected.orderDetails.forEach(x => {
        total += x.qty * x.productDiscountPrice;
      })

    return total;
  }

  setForm(customer: Customer | any) {
    this.customer = customer;
  }

  close() {
    this.visible = false;
  }

  showOrderDetail(order: Order) {
    this.orderSelected = order;
    this.isVisibleModal = true;
  }
}
