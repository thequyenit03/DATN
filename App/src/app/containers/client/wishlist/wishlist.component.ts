import {Component, OnInit} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {Product} from "../../../core/model/product";
import {CustomerService} from "../../../core/service/customer.service";
import {finalize} from "rxjs/operators";
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-wishlist',
  imports: [ShareModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  nzLoading: boolean = false;

  filter = {
    orderBy: "highlight",
    price: "all",
    take: 20
  }

  constructor(
    public service: CustomerService,
    public viewportScroller: ViewportScroller,
  ) {
  }
  ngOnInit() {
    this.getData();
  }
  getData() {
    this.service.getWishListProduct(this.filter.orderBy, this.filter.price, this.filter.take)
      .subscribe((resp: any) => {
        this.products = resp;
      })
  }
  showMore() {
    let currentLocation: [number, number] = this.viewportScroller.getScrollPosition();
    this.filter.take += 20;
    this.nzLoading = true;
    this.service.getWishListProduct(this.filter.orderBy, this.filter.price, this.filter.take)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe((resp: any) => {
        this.products = resp;
        setTimeout(() => {
          this.viewportScroller.scrollToPosition(currentLocation)
        }, 10);
      })
  }
}
