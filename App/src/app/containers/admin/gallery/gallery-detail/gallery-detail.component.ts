import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../core/util/form-helper';
import {Gallery} from '../../../../core/model/gallery';
import {ShareModule} from '../../../../share.module';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-gallery-detail',
  imports: [ShareModule],
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})
export class GalleryDetailComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<Gallery>();

  formData!: FormGroup;
  visible = false;
  srcBanner: string = "no_img.jpg";

  constructor(
    public formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      id: [0],
      type: [1, Validators.required],
      image: [""],
    });
  }

  setForm(gallery: Gallery) {
    this.formData.reset();
    this.srcBanner =environment.hostApi + "/file/"+ gallery.image;
    this.formData.patchValue(gallery);
  }

  onloadBanner(src: string) {
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
