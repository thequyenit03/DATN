import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {CustomerDetailComponent} from './customer-detail/customer-detail.component';
import {Customer} from '../../../core/model/customer';
import {CustomerService} from '../../../core/service/customer.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-customer',
  imports: [ShareModule, CustomerDetailComponent],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: CustomerDetailComponent

  datas: Customer[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: CustomerService,
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

  showDetail(customer: Customer) {
    this.spinner.show().then();
    this.service.getById(customer.code)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.visible = true;
          this.frmDetail.setForm(resp);
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }
}
