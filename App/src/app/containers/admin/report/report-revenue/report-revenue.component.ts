import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../../../core/service/report.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-report-revenue',
  imports: [ShareModule],
  templateUrl: './report-revenue.component.html',
  styleUrls: ['./report-revenue.component.css']
})
export class ReportRevenueComponent implements OnInit {
  date: Date = new Date();
  dataReport!: {
    revenues: number[],
    orderQty: number[]
  }

  chartDoanhThu: any;
  chartSoLuongDonHang: any;

  constructor(
    public service: ReportService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getRevenue(this.date)
      .subscribe({
        next: (resp: any) => {
          this.dataReport = resp;
          this.chartDoanhThu = {
            series: [
              {
                name: "Doanh thu",
                data: this.dataReport.revenues
              }
            ],
            chart: {
              type: "bar",
              height: 250
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: [
                "T1",
                "T2",
                "T3",
                "T4",
                "T5",
                "T6",
                "T7",
                "T8",
                "T9",
                "T10",
                "T11",
                "T12",
              ]
            },
            yaxis: {
              labels: {
                formatter: function (value: any) {
                  return value.toLocaleString("en-US"); // Định dạng số với dấu phẩy ngăn cách hàng nghìn
                }
              }
            }
          };
          this.chartSoLuongDonHang = {
            series: [
              {
                name: "Số lượng đơn hàng",
                data: this.dataReport.orderQty
              }
            ],
            chart: {
              height: 250,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            stroke: {
              curve: "smooth",
              width: 2
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: [
                "T1",
                "T2",
                "T3",
                "T4",
                "T5",
                "T6",
                "T7",
                "T8",
                "T9",
                "T10",
                "T11",
                "T12",
              ]
            },
            yaxis: {
              labels: {
                formatter: function (value: any) {
                  return value.toLocaleString("en-US"); // Định dạng số với dấu phẩy ngăn cách hàng nghìn
                }
              }
            }
          };
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }
}
