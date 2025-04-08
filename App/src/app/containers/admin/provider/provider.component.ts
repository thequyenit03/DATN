import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzMessageService} from "ng-zorro-antd/message";
import {finalize} from "rxjs/operators";
import {ProviderDetailComponent} from "./provider-detail/provider-detail.component";
import {Provider} from "../../../core/model/provider";
import {ProviderService} from "../../../core/service/provider.service";
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-provider',
  imports: [ShareModule, ProviderDetailComponent],
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: ProviderDetailComponent

  datas: Provider[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public providerService: ProviderService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show().then();
    this.providerService.get(this.filter)
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

  showDetail(provider: Provider) {
    this.spinner.show().then();
    this.providerService.getById(provider.code)
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

  addNew() {
    this.frmDetail.isAddNew = true;
    this.frmDetail.visible = true;
    this.frmDetail.setForm({
      code: "",
      name: "",
      phoneNumber: "",
      email: "",
      address: ""
    });
  }

  onSubmit(provider: Provider) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show().then();
      this.providerService.post(provider)
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
      this.providerService.put(provider.code, provider)
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

  delete(key: string) {
    this.spinner.show().then();
    this.providerService.deleteById(key)
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
}
