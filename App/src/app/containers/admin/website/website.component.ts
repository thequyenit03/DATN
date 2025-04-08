import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {FormHelper} from '../../../core/util/form-helper';
import {Website} from '../../../core/model/website';
import {WebsiteService} from '../../../core/service/website.service';
import {ShareModule} from '../../../share.module';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-website',
  imports: [ShareModule],
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  formData!: FormGroup;
  srcLogo: string = "no_img.jpg";

  constructor(
    public service: WebsiteService,
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
      name: ["", Validators.required],
      logo: [this.srcLogo],
      phoneNumber: [""],
      fax: [""],
      email: [""],
      address: [""],
      location: [""],
      facebook: [""],
      youtube: [""],
      copyright: [""],
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
      .subscribe(
        {
          next: (resp: any) => {
            let website: Website = resp[0];
            this.srcLogo = environment.hostApi + "/file/" + website.logo;
            this.formData.patchValue(website);
          },
          error: (error: any) => {
            this.messageService.error(error.error);
          }
        })
  }

  onloadLogo(src: string) {
    this.formData.get("logo")?.setValue(src);
  }

  submit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    this.spinner.show().then();
    let website: Website = this.formData.getRawValue();
    this.service
      .put(website.id, website)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe(
        {
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
