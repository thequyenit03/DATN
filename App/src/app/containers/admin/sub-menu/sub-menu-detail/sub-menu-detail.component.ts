import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../core/util/form-helper';
import {Menu} from '../../../../core/model/menu';
import {MenuService} from '../../../../core/service/menu.service';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-sub-menu-detail',
  imports: [ShareModule],
  templateUrl: './sub-menu-detail.component.html',
  styleUrls: ['./sub-menu-detail.component.css']
})
export class SubMenuDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Menu>();

  formData!: FormGroup;
  parentMenus: Menu[] = [];
  visible = false;

  constructor(
    public service: MenuService,
    public formBuilder: FormBuilder,
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

  setForm(menu: Menu | any) {
    this.formData.reset();
    this.formData.patchValue(menu);
    this.getParentMenu();
  }

  getParentMenu() {
    this.service.getParentSubMenu()
      .subscribe(
        (resp: any) => {
          this.parentMenus = resp;
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
