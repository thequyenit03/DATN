import {Component, OnInit} from '@angular/core';
import moment from 'moment';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Product} from '../../../../core/model/product';
import {ReportService} from '../../../../core/service/report.service';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-report-product',
  imports: [ShareModule],
  templateUrl: './report-product.component.html',
  styleUrls: ['./report-product.component.css']
})
export class ReportProductComponent implements OnInit {
  datas: Product[] = [];

  filter = {
    keySearch: "",
    rangeDate: []
  }

  constructor(
    public service: ReportService,
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
    this.service.getProductReport({
      keySearch: this.filter.keySearch,
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
}
