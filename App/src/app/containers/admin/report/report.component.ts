import {Component, OnInit} from '@angular/core';
import moment from 'moment';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Order} from '../../../core/model/order';
import {ReportService} from '../../../core/service/report.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-report',
  imports: [ShareModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  datas: Order[] = [];

  filter = {
    keySearch: "",
    status: null,
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
    this.service.getGeneralReport({
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
}
