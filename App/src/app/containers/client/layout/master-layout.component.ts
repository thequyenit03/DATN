import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Website} from '../../../core/model/website';
import {Menu} from '../../../core/model/menu';
import {Gallery} from '../../../core/model/gallery';
import {WebsiteService} from '../../../core/service/website.service';
import {GalleryService} from '../../../core/service/gallery.service';
import {EmailRegistrationService} from '../../../core/service/email-registration.service';
import {MenuService} from '../../../core/service/menu.service';
import {CartService} from '../../../core/service/cart.service';
import {ShareModule} from '../../../share.module';
import {SafePipe} from '../../../core/pipe/safe.pipe';

@Component({
  selector: 'app-master-layout',
  imports: [ShareModule, SafePipe],
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.css']
})
export class MasterLayoutComponent implements OnInit {
  formRegistration!: FormGroup;
  website!: Website;
  mainMenus: Menu[] = [];
  subMenus: Menu[] = [];
  subBanner: Gallery[] = [];
  keySearch: string = "";

  constructor(
    public websiteService: WebsiteService,
    public galleryService: GalleryService,
    public emailRegistrationService: EmailRegistrationService,
    public menuService: MenuService,
    public cartService: CartService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  get getQtyWishlist(): number {
    let sum: number = 0;
    let wishlist = localStorage.getItem("wishlist");
    if (wishlist) {
      return parseInt(wishlist);
    }
    return sum;
  }

  get getQtyItemInCart(): number {
    let sum: number = 0;
    this.cartService.getCart().forEach(x => sum += x.qty);
    return sum;
  }

  ngOnInit() {
    this.formRegistration = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
    });

    this.getWebsiteInfo();
    this.getMainMenuActive();
    this.getSubMenuActive();
    this.getBanner();
  }

  getWebsiteInfo() {
    this.websiteService.get({})
      .subscribe(
        (resp: any) => {
          this.website = resp[0];
        })
  }

  getMainMenuActive() {
    this.menuService.getMainMenuActive()
      .subscribe((resp: any) => {
        this.mainMenus = resp;
      })
  }

  getSubMenuActive() {
    this.menuService.getSubMenuActive()
      .subscribe((resp: any) => {
        this.subMenus = resp;
      })
  }

  getBanner() {
    this.galleryService.get({})
      .subscribe((resp: any) => {
        let datas: Gallery[] = resp;
        this.subBanner = datas.filter(x => x.type == 2);
      })
  }

  submitRegistration() {
    for (const i in this.formRegistration.controls) {
      if (this.formRegistration.controls.hasOwnProperty(i)) {
        this.formRegistration.controls[i].markAsDirty();
        this.formRegistration.controls[i].updateValueAndValidity();
      }
    }
    if (this.formRegistration.invalid) {
      return;
    }

    this.emailRegistrationService.post(this.formRegistration.getRawValue())
      .subscribe({
        next: () => {
          this.messageService.success("Đăng ký thành công.");
          this.formRegistration.reset();
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  search() {
    if (this.keySearch && this.keySearch != '') {
      this.navigate("/tim-kiem/" + this.keySearch)
    }
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
