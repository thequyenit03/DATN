import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {EmailTemplateDetailComponent} from './email-template-detail/email-template-detail.component';
import {EmailTemplate} from '../../../core/model/email-template';
import {EmailTemplateService} from '../../../core/service/email-template.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-email-template',
  imports: [ShareModule, EmailTemplateDetailComponent],
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css']
})
export class EmailTemplateComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: EmailTemplateDetailComponent

  datas: EmailTemplate[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: EmailTemplateService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show().then();
    this.service.get(this.filter)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = resp;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  showDetail(emailTemplate: EmailTemplate) {
    this.spinner.show().then();
    this.service.getById(emailTemplate.id)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.visible = true;
          this.frmDetail.setForm(resp);
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  onSubmit(emailTemplate: EmailTemplate) {
    this.spinner.show().then();
    this.service.put(emailTemplate.id, emailTemplate)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Cập nhật thành công");
          this.frmDetail.visible = false;
          this.getData();
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }
}
