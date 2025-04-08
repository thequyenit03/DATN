import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {finalize} from 'rxjs/operators';
import {FormHelper} from '../../../core/util/form-helper';
import {OrderDetail} from '../../../core/model/order-detail';
import {OrderService} from '../../../core/service/order.service';
import {CustomerService} from '../../../core/service/customer.service';
import {CartService} from '../../../core/service/cart.service';
import {ProductAttribute} from '../../../core/model/product-attribute';
import {DataHelper} from '../../../core/util/data-helper';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-cart',
  imports: [ShareModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  formData!: FormGroup;
  orderDetail: OrderDetail[] = [];
  nzLoading: boolean = false;

  constructor(
    public service: CartService,
    public orderService: OrderService,
    public customerService: CustomerService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  get getTotalAmount(): number {
    let total: number = 0;
    this.orderDetail.forEach(x => {
      total += x.qty * x.productDiscountPrice;
    })
   
    return total;
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      fullName: [{value: '', disabled: true}, Validators.required],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      note: [null],
      code: [null],
    });
    this.getCart();
    this.getProfile();
  }

  getProfile() {
    this.customerService.getProfile()
      .subscribe((resp: any) => {
        this.formData.patchValue(resp)
      })
  }

  getCart() {
    this.orderDetail = this.service.getCart();
  }

  updateCart() {
    this.orderDetail = this.orderDetail.filter(x => x.qty > 0);
 
    this.service.updateCart(this.orderDetail);
  }

  chooseAttribute(attributes: ProductAttribute[], index: number) {
    for (let i = 0; i < attributes.length; i++) {
      if (i == index) {
        attributes[i].checked = !attributes[i].checked;
      } else
        attributes[i].checked = false;
    }
  }

  submitForm(): void {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    let orderDetailPost: OrderDetail[] = DataHelper.clone(this.orderDetail);
    orderDetailPost.forEach(x => {
      x.attribute = "";
      if (x.attributes && x.attributes.length > 0) {
        x.attributes.forEach(y => {
          x.attribute += ('<b>' + y.name + "</b>: " + y.productAttributes.find(z => z.checked)?.value + "<br>");
        })
      }
      x.attributes = [];
    });

    this.nzLoading = true;
    this.orderService.post({
      customer: this.formData.getRawValue(),
      orderDetails: orderDetailPost
    })
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.service.clearCart();
          this.navigate("/dat-hang-thanh-cong");
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
