import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CustomerService} from "../../core/service/customer.service";
import {Router} from "@angular/router";
import {Product} from '../../core/model/product';
import {CartService} from '../../core/service/cart.service';
import {Constants} from '../../core/util/constants';

@Component({
  selector: 'app-product-template',
  standalone: false,
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.css']
})
export class ProductTemplateComponent implements OnInit {
  @Input() product!: Product
  @Output() afterUpdateWishlist = new EventEmitter();

  constructor(
    public messageService: NzMessageService,
    public cartService: CartService,
    public customerService: CustomerService,
    public router: Router,
    public ngZone: NgZone,
  ) {
  }

  ngOnInit() {
  }

  addToCart() {
    if (this.product.attributes) {
      this.product.attributes.forEach(x => {
        if (x.productAttributes.length > 0)
          x.productAttributes[0].checked = true;
      })
    }
    this.messageService.success(`Đã thêm ${this.product.name} vào giỏ hàng`);
    this.cartService.addProductToCart(this.product);
  }

  toggleWishlist() {
    if (this.product.isWishlist) {
      this.removeWishListProduct()
      this.product.isWishlist = false;
    } else {
      this.addWishListProduct();
      this.product.isWishlist = true;
    }
  }

  addWishListProduct() {
    const token = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.TOKEN);
    if (token == null) {
      this.navigate("/dang-nhap");
      return;
    }

    this.customerService.addWishListProduct(this.product.id)
      .subscribe({
        next: () => {
          this.getWishlist();
          if (this.afterUpdateWishlist) {
            this.afterUpdateWishlist.emit();
          }
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  removeWishListProduct() {
    this.customerService.removeWishListProduct(this.product.id)
      .subscribe({
        next: () => {
          this.getWishlist();
          if (this.afterUpdateWishlist) {
            this.afterUpdateWishlist.emit();
          }
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  getWishlist() {
    this.customerService.getTotalItemWishlist()
      .subscribe({
        next: (resp: any) => {
          localStorage.setItem("wishlist", resp)
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  public navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
