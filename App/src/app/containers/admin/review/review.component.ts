import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ReviewDetailComponent} from './review-detail/review-detail.component';
import {Review} from '../../../core/model/review';
import {ReviewService} from '../../../core/service/review.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-review',
  imports: [ShareModule, ReviewDetailComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: ReviewDetailComponent

  datas: Review[] = [];

  filter = {
    keySearch: "",
    status: null
  }

  constructor(
    public reviewService: ReviewService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show().then();
    this.reviewService.get({
      keySearch: this.filter.keySearch,
      status: this.filter.status ?? -1,
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

  showDetail(review: Review) {
    this.frmDetail.visible = true;
    this.frmDetail.setForm(review);
  }

  onSubmit(review: Review) {
    this.spinner.show().then();
    this.reviewService.updateStatus(review.id ?? 0, review.status)
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
