import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Attribute} from '../../../../core/model/attribute';
import {FormHelper} from '../../../../core/util/form-helper';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-attribute-detail',
  imports: [ShareModule],
  templateUrl: './attribute-detail.component.html',
  styleUrls: ['./attribute-detail.component.css']
})
export class AttributeDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Attribute>();

  formData!: FormGroup;
  visible = false;

  constructor(
    public formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ["", Validators.required]
    });
  }

  setForm(attribute: Attribute | any) {
    this.formData.reset();
    this.formData.patchValue(attribute);
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
