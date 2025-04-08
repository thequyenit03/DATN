import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormHelper} from '../../../../core/util/form-helper';
import {Menu} from '../../../../core/model/menu';
import {MenuService} from '../../../../core/service/menu.service';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-menu-detail',
  imports: [ShareModule],
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css']
})
export class MenuDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Menu>();

  formData!: FormGroup;
  parentMenus: Menu[] = [];
  visible = false;

  constructor(
    public service: MenuService,
    public formBuilder: FormBuilder,
    public messageService: NzMessageService
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required],
      type: ["", Validators.required],
      parentMenu: [null],
      index: [1],
      showHomePage: [true],
      active: [true]
    });
  }

  setForm(menu: Menu) {
    this.formData.reset();
    this.formData.patchValue(menu);
    this.getParentMenu();
  }

  getParentMenu() {
    this.service.getParentMainMenu()
      .subscribe({
        next: (resp: any) => {
          this.parentMenus = resp;
        },
        error: (error: any) => {
          this.messageService.error(error.error);
        }
      })

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
