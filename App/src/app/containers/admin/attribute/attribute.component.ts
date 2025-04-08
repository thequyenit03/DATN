import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {AttributeDetailComponent} from './attribute-detail/attribute-detail.component';
import {Attribute} from '../../../core/model/attribute';
import {AttributeService} from '../../../core/service/attribule.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-attribute',
  imports: [ShareModule, AttributeDetailComponent],
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: AttributeDetailComponent

  datas: Attribute[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: AttributeService,
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
        error: error => {
          this.messageService.error(error.error);
        }
      })
  }

  delete(attribute: Attribute) {
    this.spinner.show().then();
    this.service.deleteById(attribute.id)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: () => {
          this.messageService.success("Xóa thành công");
          this.getData();
        },
        error: error => {
          this.messageService.error(error.error);
        }
      })
  }

  addNew() {
    this.frmDetail.isAddNew = true;
    this.frmDetail.visible = true;
    this.frmDetail.setForm({
      id: 0
    });
  }

  showDetail(attribute: Attribute) {
    this.frmDetail.isAddNew = false;
    this.frmDetail.visible = true;
    this.frmDetail.setForm(attribute);
  }

  onSubmit(attribute: Attribute) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show().then();
      this.service.post(attribute)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Thêm mới thành công");
            this.getData();
            this.frmDetail.visible = false;
          },
          error: error => {
            this.messageService.error(error.error);
          }
        })
    } else {
      this.spinner.show().then();
      this.service.put(attribute.id, attribute)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Cập nhật thành công");
            this.getData();
            this.frmDetail.visible = false;
          },
          error: error => {
            this.messageService.error(error.error);
          }
        })
    }
  }
}
