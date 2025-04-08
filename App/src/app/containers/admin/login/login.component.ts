import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AdminService} from '../../../core/service/admin.service';
import {FormHelper} from '../../../core/util/form-helper';
import {ShareModule} from '../../../share.module';

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
    public service: AdminService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
    public ngZone: NgZone,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
      remember: [true]
    });
  }

  onSubmit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.service
      .login(this.formData.getRawValue())
      .subscribe(
        {
          next: () => {
            this.messageService.success("Đăng nhập thành công");
            this.navigate("/admin")
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        }
      );
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }

}
