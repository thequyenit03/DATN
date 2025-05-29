import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';  // Import forkJoin để gộp các Observable
import { FormHelper } from '../../../core/util/form-helper';
import { OrderDetail } from '../../../core/model/order-detail';
import { OrderService } from '../../../core/service/order.service';
import { CustomerService } from '../../../core/service/customer.service';
import { CartService } from '../../../core/service/cart.service';
import { ProductAttribute } from '../../../core/model/product-attribute';
import { DataHelper } from '../../../core/util/data-helper';
import { ShareModule } from '../../../share.module';
import { PaymentService } from '../../../core/service/payment.service';

@Component({
  selector: 'app-cart',
  imports: [ShareModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  formData!: FormGroup;
  orderDetail: OrderDetail[] = [];
  nzLoading: boolean = false;
  paymentStatus: string = '';
  paymentMessage: string = '';
  isProcessingPayment: boolean = false;
  isProfileLoaded: boolean = false; // Cờ để đánh dấu khi profile đã được load

  private readonly CUSTOMER_TEMP_KEY = 'checkout_customer';

  constructor(
    public service: CartService,
    public orderService: OrderService,
    public customerService: CustomerService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
    public ngZone: NgZone,
    public router: Router,
    private paymentService: PaymentService,
    private active: ActivatedRoute
  ) {}

  get getTotalAmount(): number {
    let total: number = 0;
    this.orderDetail.forEach(x => {
      total += x.qty * x.productDiscountPrice;
    });
    return total;
  }

  ngOnInit() {
    // Khởi tạo form với các trường cần thiết
    this.formData = this.formBuilder.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      address: [null, Validators.required],
      note: [null],
      code: [null],
    });    
    // Đăng ký lắng nghe queryParams để kiểm tra xem có tham số thanh toán hay không
    this.active.queryParams.subscribe(params => {
      if (params['vnp_TxnRef']) {
         this.orderDetail = this.service.restoreCartFromBackup();         
        // Nếu có tham số thanh toán, chúng ta sử dụng forkJoin để load profile và xác thực thanh toán cùng lúc
        this.isProcessingPayment = true;
        forkJoin({
          profile: this.customerService.getProfile(),
          paymentResult: this.paymentService.verifyPayment(params)
        }).subscribe({
          next: ({ profile, paymentResult }) => {
            // Patch dữ liệu profile vào form và đánh dấu đã load xong
             if (sessionStorage.getItem(this.CUSTOMER_TEMP_KEY)) {
            this.restoreCustomerInfo();
            this.isProfileLoaded = true;
          } else {
            // Ngược lại patch profile từ server
            this.getProfile();
            this.formData.patchValue(profile);
            this.isProfileLoaded = true;
          }

            // Xử lý kết quả trả về từ verifyPayment
            let parsedResult;
            try {
              parsedResult = typeof paymentResult === 'string'
                ? JSON.parse(paymentResult)
                : paymentResult;
            } catch (error) {
              parsedResult = paymentResult;
            }

            this.paymentStatus = parsedResult.status;
            this.paymentMessage = parsedResult.status === "1" ? "Thanh toán thành công!" : "Thanh toán thất bại!";
            this.isProcessingPayment = false;

            if (parsedResult.status === "1") {
              // Nếu thanh toán thành công, gọi submitForm để đặt hàng
              this.submitForm();
            } else {
              this.router.navigate(["/dat-hang-that-bai"]);
            }
          },
          error: (err) => {
            console.error("ForkJoin error:", err);
            this.paymentStatus = "2";
            this.paymentMessage = "Thanh toán thất bại!";
            this.isProcessingPayment = false;
            this.router.navigate(["/dat-hang-that-bai"]);
          }
        });
      } else {
        // Nếu không có tham số thanh toán, chỉ load profile        
        this.getProfile();
        this.orderDetail = this.service.getCart();
      }
    });
  }

  getProfile() {
    this.customerService.getProfile().subscribe((resp: any) => {
      this.formData.patchValue(resp);
      this.isProfileLoaded = true;
    });
  }

  updateCart() {
    this.orderDetail = this.orderDetail.filter(x => x.qty > 0);
    this.service.updateCart(this.orderDetail);
  }

  chooseAttribute(attributes: ProductAttribute[], index: number) {
    for (let i = 0; i < attributes.length; i++) {
      attributes[i].checked = (i === index) ? !attributes[i].checked : false;
    }
     this.service.updateCart(this.orderDetail);
  }

  // Backup formData trước khi redirect
  private backupCustomerInfo(): void {
    sessionStorage.setItem(
      this.CUSTOMER_TEMP_KEY,
      JSON.stringify(this.formData.getRawValue())
    );
  }
  private restoreCustomerInfo(): void {    
    const json = sessionStorage.getItem(this.CUSTOMER_TEMP_KEY);
    if (!json) return;
    try {
      const data = JSON.parse(json);
      this.formData.patchValue(data);
    } catch {}
    sessionStorage.removeItem(this.CUSTOMER_TEMP_KEY);
  }
  submitForm(): void {
    // Đảm bảo rằng profile đã được load trước khi submit
    if (!this.isProfileLoaded) {
      console.warn("Profile data is not loaded yet.");
      return;
    }
    FormHelper.markAsDirty(this.formData);
    if (this.formData.invalid) {
      return;
    }

    let orderDetailPost: OrderDetail[] = DataHelper.clone(this.orderDetail);
    orderDetailPost.forEach(x => {
      x.attribute = "";
      if (x.attributes && x.attributes.length > 0) {
        x.attributes.forEach(y => {
          x.attribute += ('<b>' + y.name + "</b>: " + y.productAttributes.find(z => z.checked)?.value + "<br>");
        });
      }
      x.attributes = [];
    });

    this.nzLoading = true;
    console.log('PAYLOAD customer:', this.formData.getRawValue());
    this.orderService.post({
      customer: this.formData.getRawValue(),
      orderDetails: orderDetailPost
    })
      .pipe(finalize(() => {
        this.nzLoading = false;
      }))
      .subscribe({
        next: () => {
          this.service.clearCart();
          sessionStorage.removeItem(this.CUSTOMER_TEMP_KEY);
          this.router.navigate(["/dat-hang-thanh-cong"]);
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      });
  }

  parseNumber(value: string): number {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0;
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }

  // Tạo link thanh toán
  createPaymentLink() {    
    // Đánh dấu tất cả các control trên form là dirty để hiển thị lỗi nếu có
  FormHelper.markAsDirty(this.formData);
  
  // Kiểm tra tính hợp lệ của form
  if (this.formData.invalid) {
    this.messageService.error("Vui lòng điền đầy đủ thông tin yêu cầu!");
    return;
  }
    const totalAmount = this.getTotalAmount;
    this.paymentService.createPaymentLink(totalAmount)
      .subscribe({
        next: (paymentUrl) => {
          this.backupCustomerInfo();
          this.service.backupCart();
          window.location.href = paymentUrl;
        },
        error: (err) => {
          this.messageService.error("Lỗi tạo link thanh toán", err);
        }
      });
  }
deleteProduct(productName: string): void {       
    // Lọc bỏ các mục có tên sản phẩm trùng với productName được truyền vào
    this.orderDetail = this.orderDetail.filter(
      item => item.productName !== productName
    );
    // Cập nhật lại giỏ hàng qua service
    this.service.updateCart(this.orderDetail);
    // Hiển thị thông báo thành công cho người dùng
    this.messageService.success('Đã xóa sản phẩm khỏi giỏ hàng!');
  }


}
