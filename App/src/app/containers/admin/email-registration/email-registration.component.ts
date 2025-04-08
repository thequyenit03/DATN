import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {EmailRegistrationService} from '../../../core/service/email-registration.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-email-registration',
  imports: [ShareModule],
  templateUrl: './email-registration.component.html',
  styleUrls: ['./email-registration.component.css']
})
export class EmailRegistrationComponent implements OnInit {
  datas: { email: string, created: Date }[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: EmailRegistrationService,
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
}
