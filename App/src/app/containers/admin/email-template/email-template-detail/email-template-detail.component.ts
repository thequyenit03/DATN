import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {EmailTemplate} from '../../../../core/model/email-template';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-email-template-detail',
  imports: [ShareModule],
  templateUrl: './email-template-detail.component.html',
  styleUrls: ['./email-template-detail.component.css']
})
export class EmailTemplateDetailComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<EmailTemplate>();

  formData!: FormGroup;
  visible = false;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'calc(100vh - 500px)',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    defaultParagraphSeparator: 'p'
  };

  constructor(
    public formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      id: [0],
      type: [{value: '', disabled: true}],
      subject: ["", Validators.required],
      cc: [""],
      bcc: [""],
      keyGuide: [""],
      content: [""]
    });
  }

  setForm(emailTemplate: EmailTemplate) {
    this.formData.reset();
    this.formData.patchValue(emailTemplate);
  }

  close() {
    this.visible = false;
  }

  submit() {
    this.onSubmit.emit(this.formData.getRawValue());
  }

}
