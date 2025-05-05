import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Order} from '../../core/model/order';
import {OrderDetail} from '../../core/model/order-detail';
import {Review} from '../../core/model/review';
import {ReviewService} from '../../core/service/review.service';

@Component({
  selector: 'app-order-template',
  standalone: false,
  templateUrl: './order-template.component.html',
  styleUrls: ['./order-template.component.css']
})
export class OrderTemplateComponent implements OnInit {
  @Input() order!: Order;

  orderDetailSelected!: OrderDetail;
  isVisibleModal: boolean = false;
  tooltips = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];
  reviewModel!: Review;

  constructor(
    public service: ReviewService,
    public messageService: NzMessageService,
  ) {
  }

  get getTotalAmount(): number {
    let total: number = 0;
    this.order.orderDetails.forEach(x => {
      total += x.qty * x.productDiscountPrice;
    })

    return total;
  }

  ngOnInit(): void {
  }

  review(orderDetail: OrderDetail) {
    this.orderDetailSelected = orderDetail;
    this.service.getByOrder(this.orderDetailSelected.id ?? 0)
      .subscribe({
        next: (resp: any) => {
          let data: Review = resp;
          if (data == null) {
            this.reviewModel = {
              content: "",
              star: 0,
              status: -1
            } as Review;
          } else {
            this.reviewModel = data;
          }
          this.isVisibleModal = true;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  confirmReview() {
    // Lấy giá trị đánh giá sao và nội dung đánh giá từ form
    const star: number = this.reviewModel.star;
    // Nếu this.reviewModel.content bị null hoặc undefined, tự gán là chuỗi mặc định " " (có thể thay đổi theo yêu cầu)
    const content: string = this.reviewModel.content?.trim() ?? " ";

    // Kiểm tra giá trị star phải nằm trong khoảng 1 đến 5
    if (typeof star !== 'number' || star < 1 || star > 5) {
      this.messageService.error("Vui lòng đánh giá từ 1 đến 5 sao.");
      return;
    }

    // Kiểm tra nội dung đánh giá không được để trống sau khi loại bỏ khoảng trắng
    if (content.length === 0) {
      this.messageService.error("Nội dung đánh giá không được để trống.");
      return;
    }
    this.service.post({
      orderDetailId: this.orderDetailSelected.id,
      star: star,
      content: content
    } as Review)
      .subscribe({
        next: () => {
          this.messageService.success("Thành công");
          this.isVisibleModal = false;
          this.orderDetailSelected.isReview = true;
        },
        error: (error: any) => {
          this.messageService.error(error.message);
        }
      })
  }
}
