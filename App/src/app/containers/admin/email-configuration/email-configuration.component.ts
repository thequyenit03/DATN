import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {FormHelper} from '../../../core/util/form-helper';
import {EmailConfigurationService} from '../../../core/service/email-configuration.service';
import {EmailConfiguration} from '../../../core/model/email-configuration';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-email-configuration',
  imports: [ShareModule],
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.css']
})
export class EmailConfigurationComponent implements OnInit {
  formData!: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    public service: EmailConfigurationService,
    public formBuilder: FormBuilder,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.formData = this.formBuilder.group({
      id: [0],
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  getData() {
    this.spinner.show().then();
    this.service.get({})
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.formData.patchValue(resp);
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  submit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.spinner.show().then();
    let config: EmailConfiguration = this.formData.getRawValue();
    this.service
      .put(config.id, config)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
          next: () => {
            this.messageService.success("Cập nhật thành công");
            this.getData()
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        }
      );
  }
}
