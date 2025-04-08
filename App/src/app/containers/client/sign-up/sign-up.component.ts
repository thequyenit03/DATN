import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {finalize} from 'rxjs/operators';
import {FormHelper} from '../../../core/util/form-helper';
import {CustomerService} from '../../../core/service/customer.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-sign-up',
  imports: [ShareModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  currentStep: number = 0;
  nzLoading: boolean = false;
  formMail!: FormGroup;
  formOTP!: FormGroup;
  formData!: FormGroup;

  constructor(
    public customerService: CustomerService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.formMail = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
    });
    this.formOTP = this.formBuilder.group({
      oTP: [null, Validators.required],
    });
    this.formData = this.formBuilder.group({
      email: [{value: '', disabled: true}, Validators.required],
      oTP: [{value: '', disabled: true}, Validators.required],
      password: ["", Validators.required],
      fullName: ["Trần Thắng", Validators.required],
      phoneNumber: [null, Validators.required]
    });
  }

  requestOTP() {
    for (const i in this.formMail.controls) {
      if (this.formMail.controls.hasOwnProperty(i)) {
        this.formMail.controls[i].markAsDirty();
        this.formMail.controls[i].updateValueAndValidity();
      }
    }
    if (this.formMail.invalid) {
      return;
    }
    this.nzLoading = true;
    this.customerService.requestOTP(this.formMail.getRawValue().email)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Mã OTP đã được gửi vào hòm thư của bạn.");
          this.currentStep = 1;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  confirmOTP() {
    for (const i in this.formOTP.controls) {
      if (this.formOTP.controls.hasOwnProperty(i)) {
        this.formOTP.controls[i].markAsDirty();
        this.formOTP.controls[i].updateValueAndValidity();
      }
    }
    if (this.formOTP.invalid) {
      return;
    }

    const email = this.formMail.getRawValue().email;
    const otp = this.formOTP.getRawValue().oTP;
    this.nzLoading = true;
    this.customerService
      .confirmOTP(email, otp)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: (resp: any) => {
          let data: boolean = resp;
          if (data) {
            this.currentStep = 2;
            this.formData.patchValue({
              email: email,
              oTP: otp
            })
          } else {
            this.messageService.error("Mã OTP không đúng.");
          }
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  onSubmit(): void {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.nzLoading = true;
    this.customerService.post(this.formData.getRawValue())
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Đăng ký thành công");
          this.navigate("/dang-nhap")
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}
