import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ArticleDetailComponent} from './article-detail/article-detail.component';
import {Article} from '../../../core/model/article';
import {ShareModule} from '../../../share.module';
import {ArticleService} from '../../../core/service/article.service';

@Component({
  selector: 'app-article',
  imports: [ShareModule, ArticleDetailComponent],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: ArticleDetailComponent

  datas: Article[] = [];

  filter = {
    keySearch: ""
  }

  constructor(
    public service: ArticleService,
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

  delete(article: Article) {
    this.spinner.show().then();
    this.service.deleteById(article.id)
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
      id: 0,
      index: 1,
      active: true
    } as Article);
  }

  showDetail(article: Article) {
    this.spinner.show().then();
    this.service.getById(article.id)
      .pipe(
        finalize(() => {
          this.spinner.hide().then();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.isAddNew = false;
          this.frmDetail.visible = true;
          this.frmDetail.setForm(resp);
        },
        error: error => {
          this.messageService.error(error.error);
        }
      })
  }

  onSubmit(article: Article) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show().then();
      this.service.post(article)
        .pipe(
          finalize(() => {
            this.spinner.hide().then();
          })
        )
        .subscribe({
          next: () => {
            this.messageService.success("Thêm mới thành công");
            this.frmDetail.visible = false;
            this.getData();
          },
          error: error => {
            this.messageService.error(error.error);
          }
        })
    } else {
      this.spinner.show().then();
      this.service.put(article.id, article)
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
          error: error => {
            this.messageService.error(error.error);
          }
        })
    }

  }
}
