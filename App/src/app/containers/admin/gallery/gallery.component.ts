import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {GalleryDetailComponent} from './gallery-detail/gallery-detail.component';
import {Gallery} from '../../../core/model/gallery';
import {GalleryService} from '../../../core/service/gallery.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-gallery',
  imports: [ShareModule, GalleryDetailComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  @ViewChild("frmDetail", {static: true}) frmDetail!: GalleryDetailComponent

  datas: Gallery[] = [];

  constructor(
    public service: GalleryService,
    public spinner: NgxSpinnerService,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.getData();
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
          this.datas =resp;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  delete(key: number) {
    this.spinner.show().then();
    this.service.deleteById(key)
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
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }

  addNew() {
    this.frmDetail.visible = true;
    this.frmDetail.setForm({
      id: 0,
      type: 1,
      image: "no_img.jpg"
    } as Gallery);
  }

  onSubmit(gallery: Gallery) {
    this.spinner.show().then();
    this.service.post(gallery)
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
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })
  }
}
