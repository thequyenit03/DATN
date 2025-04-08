import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {Product} from '../../../core/model/product';
import {Menu} from '../../../core/model/menu';
import {ProductService} from '../../../core/service/product.service';
import {MenuService} from '../../../core/service/menu.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-product',
  imports: [ShareModule, ProductDetailComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: ProductDetailComponent

  datas: Product[] = [];
  menus: Menu[] = [];

  filter = {
    keySearch: "",
    menuId: null,
  }
  constructor(
    public service: ProductService,
    public menuService: MenuService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
    this.getMenu();
  }

  getMenu() {
    this.menuService.getByType(['san-pham'])
      .subscribe({
        next: (resp: any) => {
          this.menus = resp;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  getData() {
    this.spinner.show().then();
    this.service.get({
      keySearch: this.filter.keySearch,
      menuId: this.filter.menuId ?? ""
    })
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = resp;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  delete(product: Product) {
    this.spinner.show().then();
    this.service.deleteById(product.id)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Xóa thành công");
          this.getData();
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  addNew() {
    this.frmDetail.isAddNew = true;
    this.frmDetail.visible = true;
    this.frmDetail.setForm({
      id: 0,
      index: 1,
      status: 10,
      selling: true,
      price: 0,
      discountPrice: 0,
    } as Product);
  }

  showDetail(product: Product) {
    this.spinner.show().then();
    this.service.getById(product.id)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.isAddNew = false;
          this.frmDetail.visible = true;
          this.frmDetail.setForm(resp);
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  onSubmit(product: Product) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show().then();
      this.service.post(product)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Thêm mới thành công");
            this.frmDetail.visible = false;
            this.getData();
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    } else {
      this.spinner.show().then();
      this.service.put(product.id, product)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Cập nhật thành công");
            this.frmDetail.visible = false;
            this.getData();
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    }
  }
}
