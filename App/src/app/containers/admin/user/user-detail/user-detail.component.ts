import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormHelper} from '../../../../core/util/form-helper';
import {User} from '../../../../core/model/user';
import {UserService} from '../../../../core/service/user.service';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-user-detail',
  imports: [ShareModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<User>();

  user!: User;
  formData!: FormGroup;
  visible = false;

  constructor(
    public userService: UserService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
      fullName: ["", Validators.required],
      phone: [null],
      email: [null],
      active: [true]
    });
  }

  setForm(user: User) {
    this.user = user;
    this.formData.reset();
    this.formData.patchValue(user);
    if (this.isAddNew) {
      this.formData.controls['userName']?.enable();
      this.formData.controls['password']?.setValidators([Validators.required]);
      this.formData.controls['password']?.updateValueAndValidity();
    } else {
      this.formData.controls['userName']?.disable();
      this.formData.controls['password']?.clearValidators();
      this.formData.controls['password']?.updateValueAndValidity();
    }
  }

  close() {
    this.visible = false;
  }

  submit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.onSubmit.emit(this.formData.getRawValue());
  }

  resetPassword() {
    let newPassword = prompt("Mật khẩu mới:", "");
    if (newPassword) {
      this.userService.resetPassword(this.user.userName, newPassword)
        .subscribe({
          next: () => {
            this.messageService.success("Cập nhật thành công");
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
    }
  }
}
