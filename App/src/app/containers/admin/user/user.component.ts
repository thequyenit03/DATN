import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {User} from '../../../core/model/user';
import {UserService} from '../../../core/service/user.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-user',
  imports: [ShareModule, UserDetailComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: UserDetailComponent

  datas: User[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: UserService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show().then();
    this.service.get(this.filter)
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

  delete(user: User) {
    this.spinner.show().then();
    this.service.deleteById(user.userName)
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
      active: true
    } as User);
  }

  showDetail(user: User) {
    this.frmDetail.isAddNew = false;
    this.frmDetail.visible = true;
    this.frmDetail.setForm(user);
  }

  onSubmit(user: User) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show().then();
      this.service.post(user)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Thêm mới thành công");
            this.getData();
            this.frmDetail.close()
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    } else {
      this.spinner.show().then();
      this.service.put(user.userName, user)
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
