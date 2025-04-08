import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ReportService} from '../../../core/service/report.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-dashboard',
  imports: [ShareModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  date: Date = new Date();
  dataHighlight!: ReportHighlight

  chartDoanhThu: any;
  chartSoLuongDonHang: any;

  chartTrangThai: any;

  constructor(
    public service: ReportService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getHighlight(this.date)
      .subscribe({
        next: (resp: any) => {
          this.dataHighlight = resp;

          this.chartTrangThai = {
            series: this.dataHighlight.orderQtyByStatus,
            chart: {
              width: 380,
              type: "pie"
            },
            labels: ["Tạo mới", "Đã xác nhận", "Đang vận chuyển", "Đã hoàn thành", "Đã hủy"],
            colors: ["#6bcc21", "#3ca5ff", "#0097a7", "#ffa924", "#e20606"],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };

          this.chartDoanhThu = {
            series: [
              {
                name: "Doanh thu",
                data: this.dataHighlight.revenues
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
                data: this.dataHighlight.orderQty
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

export interface ReportHighlight {
  totalNewOrder: number;
  dailySales: number;
  totalOrder: number;
  salesRevenue: number;
  orderQty: number[];
  orderQtyByStatus: number[];
  revenues: number[];
}
