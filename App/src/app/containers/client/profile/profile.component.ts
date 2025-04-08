import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import moment from 'moment';
import {NzMessageService} from 'ng-zorro-antd/message';
import {finalize} from 'rxjs/operators';
import {FormHelper} from '../../../core/util/form-helper';
import {Customer} from '../../../core/model/customer';
import {Order} from '../../../core/model/order';
import {CustomerService} from '../../../core/service/customer.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-profile',
  imports: [ShareModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  formData!: FormGroup;
  formChangePassword!: FormGroup;
  profile!: Customer;
  nzLoading: boolean = false;
  orders: Order[] = [];

  constructor(
    public service: CustomerService,
    public messageService: NzMessageService,
    public formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    
    this.formData = this.formBuilder.group({
      code: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, Validators.required],
      fullName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      dob: [null],
      gender: [null],
      timePicker: [null]
    });
    this.formChangePassword = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required]
    });
    this.getProfile();
    this.getOrders();
  }

  getProfile() {
    this.service.getProfile()
      .subscribe((resp: any) => {
        this.profile = resp;
        this.formData.patchValue(this.profile)
      })
  }

  getOrders() {
    this.service.getOrders()
      .subscribe((resp: any) => {
        this.orders = resp;
      })
  }

  filterOrderByStatus(status: number): Order[] {
    return this.orders.filter(x => x.status == status);
  }

  submitForm(): void {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    let dataPost = this.formData.getRawValue();
    if (dataPost.dob)
      dataPost.dob = moment(new Date(dataPost.dob)).format("YYYY-MM-DDTHH:mm:ss")

    this.nzLoading = true;
    this.service.updateProfile(dataPost)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Cập nhật thành công");
          this.getProfile();
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  submitChangePassword(): void {
    for (const i in this.formChangePassword.controls) {
      if (this.formChangePassword.controls.hasOwnProperty(i)) {
        this.formChangePassword.controls[i].markAsDirty();
        this.formChangePassword.controls[i].updateValueAndValidity();
      }
    }
    if (this.formChangePassword.invalid) {
      return;
    }

    const dataPost = this.formChangePassword.getRawValue();

    this.nzLoading = true;
    this.service.changePassword(dataPost["oldPassword"], dataPost["newPassword"])
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Cập nhật thành công");
          this.formChangePassword.reset();
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }
}
