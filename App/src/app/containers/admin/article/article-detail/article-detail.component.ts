import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ShareModule} from '../../../../share.module';
import {Article} from '../../../../core/model/article';
import {Menu} from '../../../../core/model/menu';
import {MenuService} from '../../../../core/service/menu.service';
import {DataHelper} from '../../../../core/util/data-helper';
import {FormHelper} from '../../../../core/util/form-helper';
import {NzMessageService} from 'ng-zorro-antd/message';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-article-detail',
  imports: [ShareModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Article>();

  menus: Menu[] = [];
  formData!: FormGroup;
  visible = false;
  srcImage: string = "no_img.jpg";
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'calc(100vh - 400px)',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    defaultParagraphSeparator: 'p',
  };

  constructor(
    public service: MenuService,
    public formBuilder: FormBuilder,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      id: [0],
      menuId: [0, Validators.required],
      title: ["", Validators.required],
      alias: ["", Validators.required],
      image: [""],
      index: [1],
      shortDescription: [""],
      description: [""],
      active: [true]
    });
  }

  setForm(article: Article) {
    this.formData.reset();
    this.srcImage = environment.hostApi + "/file/" + article.image;
    this.formData.patchValue(article);
    this.getMenu();
  }

  getMenu() {
    this.service.getByType(['bai-viet', 'chi-tiet-bai-viet'])
      .subscribe({
        next: (resp: any) => {
          this.menus = resp;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })

  }

  changeTitle(e: any) {
    this.formData.patchValue({
      alias: DataHelper.unsign(e)
    })
  }

  onloadImage(src: string) {
    this.formData.get("image")?.setValue(src);
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
}
