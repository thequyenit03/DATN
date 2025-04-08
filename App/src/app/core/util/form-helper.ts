import {AbstractControl, FormArray, FormGroup} from "@angular/forms";

export class FormHelper {
  static markAsDirty(form: AbstractControl) {
    if (form instanceof FormGroup || form instanceof FormArray) {
      Object.values(form.controls).forEach(control => {
        this.markAsDirty(control);
      });
    } else {
      form.markAsDirty();
      form.updateValueAndValidity();
    }
  }
}
