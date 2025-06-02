import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ShareModule} from '../../../share.module';
import { OrderService } from '../../../core/service/order.service';
import { Order } from '../../../core/model/order';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Review } from '../../../core/model/review';
import { ReviewService } from '../../../core/service/review.service';

@Component({
  selector: 'app-master-layout',
  imports: [ShareModule],
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.css']
})
export class MasterLayoutComponent implements OnInit {
  isCollapsed: boolean = false;
  formData!: FormGroup;
  orders: Order[] = [];
  datas: Review[] = [];
  intervalid: any;
   filter = {
    keySearch: "",
    status: null,
    rangeDate: []
  }
  filter1 = {
    keySearch: "",
    status: null
  }
  constructor(
    public ngZone: NgZone,
    public router: Router,
    public service: OrderService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService,
    public reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.getDataOrder();
    this.getDataReview();
    this.intervalid = setInterval(()=>{
      this.getDataOrder();
      this.getDataReview();      
    }, 3000);
  }
   getDataOrder() {
      let fDate: string = "";
      let tDate: string = "";
  
      if (this.filter.rangeDate && this.filter.rangeDate.length == 2) {
        fDate = moment(new Date(this.filter.rangeDate[0])).format("YYYY-MM-DDTHH:mm:ss")
        tDate = moment(new Date(this.filter.rangeDate[1])).format("YYYY-MM-DDTHH:mm:ss")
      }
  
      this.spinner.show().then();
      this.service.getWIP({
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
            this.orders = resp;
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    }


  getDataReview() {
      this.spinner.show().then();
      this.reviewService.get({
        keySearch: this.filter1.keySearch,
        status: this.filter1.status ?? -1,
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

  logout() {
    this.navigate("/admin/dang-xuat")
  }
  
  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  filterOrderByStatus(status: number): Order[] {
    return this.orders.filter(x => x.status == status);
  }
  filterReviewByStatus(status: number): Review[]{
    return this.datas.filter(x => x.status == status);
  }

  ngDestroy() {
    if (this.intervalid) {
      clearInterval(this.intervalid);
    }
  }

}
