import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Provider} from "../../../../core/model/provider";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormHelper} from '../../../../core/util/form-helper';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-provider-detail',
  imports: [ShareModule],
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css']
})
export class ProviderDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Provider>();

  formData!: FormGroup;
  visible = false;

  constructor(
    public formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      code: [""],
      name: ["", Validators.required],
      phoneNumber: [""],
      email: [""],
      address: [""]
    });
  }

  setForm(provider: Provider | any) {
    this.formData.reset();
    this.formData.patchValue(provider);
  }

  close() {
    this.visible = false;
  }

  submit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    let dataForm = this.formData.getRawValue();

    this.onSubmit.emit(dataForm);
  }

}
