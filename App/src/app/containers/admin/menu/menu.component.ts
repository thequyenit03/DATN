import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MenuDetailComponent} from './menu-detail/menu-detail.component';
import {Menu} from '../../../core/model/menu';
import {MenuService} from '../../../core/service/menu.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-menu',
  imports: [ShareModule, MenuDetailComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: MenuDetailComponent

  datas: Menu[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: MenuService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show().then();
    this.service.getMainMenu(this.filter)
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

  delete(menu: Menu) {
    this.spinner.show().then();
    this.service.deleteById(menu.id)
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
    } as Menu);
  }

  showDetail(menu: Menu) {
    this.frmDetail.isAddNew = false;
    this.frmDetail.visible = true;
    this.frmDetail.setForm(menu);
  }

  onSubmit(menu: Menu) {
    if (this.frmDetail.isAddNew) {
      menu.group = "main";
      this.spinner.show().then();
      this.service.post(menu)
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
      this.service.put(menu.id, menu)
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
