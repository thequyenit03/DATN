import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Product} from '../../../core/model/product';
import {ProductService} from '../../../core/service/product.service';
import {CartService} from '../../../core/service/cart.service';
import {ProductAttribute} from '../../../core/model/product-attribute';
import {ShareModule} from '../../../share.module';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-detail',
  imports: [ShareModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productAlias: string = ""
  product!: Product;
  qty: number = 1;
  image: string = "./assets/imgs/tivi.png";

  customOptions: OwlOptions = {
    loop: false,
    items:4,
    margin:10,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    nav: false
  }

  constructor(
    public service: ProductService,
    public activatedRoute: ActivatedRoute,
    public cartService: CartService,
    public messageService: NzMessageService,
    public ngZone: NgZone,
    public router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.productAlias = this.activatedRoute.snapshot.params['alias'];
        this.getData();
      }
    }).then();
  }

  ngOnInit() {
   
    this.productAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    this.service.getByAlias(this.productAlias)
      .subscribe((resp: any) => {
        this.product = resp;
      })
  }

  showImg(src: string) {
    this.product.image = src;
  }

  chooseAttribute(attributes: ProductAttribute[], index: number) {
    for (let i = 0; i < attributes.length; i++) {
      if (i == index) {
        attributes[i].checked = !attributes[i].checked;
      } else
        attributes[i].checked = false;
    }
  }

  addToCart() {
    if (this.product.attributes && this.product.attributes.length > 0) {
      if (!(this.product.attributes.findIndex(x => x.productAttributes.findIndex(y => y.checked) >= 0) >= 0)) {
        this.messageService.error("Chọn ít nhất một thuộc tính sản phẩm")
        return;
      }
    }

    if (this.product.qty < this.qty) {
      this.messageService.error("Số lượng vượt quá lượng trong kho sản phẩm")
      return;
    }

    this.messageService.success(`Đã thêm ${this.product.name} vào giỏ hàng`);
    this.cartService.addProductToCart(this.product, this.qty);
  }

  buyNow() {
    if (this.product.attributes && this.product.attributes.length > 0) {
      if (!(this.product.attributes.findIndex(x => x.productAttributes.findIndex(y => y.checked) >= 0) >= 0)) {
        this.messageService.error("Chọn ít nhất một thuộc tính sản phẩm")
        return;
      }
    }

    this.cartService.addProductToCart(this.product, this.qty);
    this.navigate("/gio-hang");
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
