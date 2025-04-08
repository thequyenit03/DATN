import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormHelper} from '../../../core/util/form-helper';
import {ShareModule} from '../../../share.module';
import {CustomerService} from '../../../core/service/customer.service';

@Component({
  selector: 'app-login',
  imports: [ShareModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formData!: FormGroup;

  isShowPassword: boolean = false

  constructor(
    public service: CustomerService,
    public formBuilder: FormBuilder,
    public messageService: NzMessageService,
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ["", Validators.required],
      remember: [true]
    });
  }

  onSubmit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.service.login(this.formData.getRawValue())
      .subscribe({
        next: () => {
          this.messageService.success("Đăng nhập thành công");
          this.navigate("/");
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
