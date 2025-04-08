import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {finalize} from 'rxjs/operators';
import {FormHelper} from '../../../core/util/form-helper';
import {CustomerService} from '../../../core/service/customer.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-forgot-password',
  imports: [ShareModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  formData!: FormGroup;
  nzLoading: boolean = false;

  constructor(
    public service: CustomerService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]]
    });
  }

  onSubmit(): void {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.nzLoading = true;
    this.service.forgotPassword(this.formData.getRawValue().email)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Yêu cầu cấp lại mật khẩu thành công. Vui lòng kiểm tra thông tin tại hòm thư của bạn.");
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
