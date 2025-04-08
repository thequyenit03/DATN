import {Component, OnInit, ViewChild} from '@angular/core';
import moment from 'moment';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {Order} from '../../../core/model/order';
import {OrderService} from '../../../core/service/order.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-order',
  imports: [ShareModule, OrderDetailComponent],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: OrderDetailComponent
  datas: Order[] = [];
  orderSelected!: Order;

  filter = {
    keySearch: "",
    status: null,
    rangeDate: []
  }

  constructor(
    public service: OrderService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    let fDate: string = "";
    let tDate: string = "";

    if (this.filter.rangeDate && this.filter.rangeDate.length == 2) {
      fDate = moment(new Date(this.filter.rangeDate[0])).format("YYYY-MM-DDTHH:mm:ss")
      tDate = moment(new Date(this.filter.rangeDate[1])).format("YYYY-MM-DDTHH:mm:ss")
    }

    this.spinner.show().then();
    this.service.get({
      keySearch: this.filter.keySearch,
      status: this.filter.status ?? -1,
      fDate,
      tDate
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

  showOrderDetail(order: Order) {
    this.orderSelected = order;
    this.spinner.show().then();
    this.service.getById(order.id)
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

  onChangeStatus(status: number) {
    this.spinner.show().then();
    this.service.changeStatus(this.orderSelected.id, status)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Cập nhật thành công");
          this.showOrderDetail(this.orderSelected);
          this.getData();
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }
}
