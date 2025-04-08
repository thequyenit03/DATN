import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {SubMenuDetailComponent} from './sub-menu-detail/sub-menu-detail.component';
import {Menu} from '../../../core/model/menu';
import {MenuService} from '../../../core/service/menu.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-sub-menu',
  imports: [ShareModule, SubMenuDetailComponent],
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: SubMenuDetailComponent

  datas: Menu[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public menuService: MenuService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show().then();
    this.menuService.getSubMenu(this.filter)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe(
        {
          next: (resp: any) => {
            this.datas = resp;
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
  }

  delete(menu: Menu) {
    this.spinner.show().then();
    this.menuService.deleteById(menu.id)
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
      active: true,
      index: 1,
      showHomePage: true
    });
  }

  showDetail(menu: Menu) {
    this.frmDetail.isAddNew = false;
    this.frmDetail.visible = true;
    this.frmDetail.setForm(menu);
  }

  onSubmit(menu: Menu) {
    if (this.frmDetail.isAddNew) {
      menu.group = "sub";
      this.spinner.show().then();
      this.menuService.post(menu)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Thêm mới thành công");
            this.getData();
            this.frmDetail.visible = false;
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    } else {
      this.spinner.show().then();
      this.menuService.put(menu.id, menu)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Cập nhật thành công");
            this.getData();
            this.frmDetail.visible = false;
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    }
  }
}
