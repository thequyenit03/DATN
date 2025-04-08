import {Component, EventEmitter, Output} from '@angular/core';
import {Review} from '../../../../core/model/review';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-review-detail',
  imports: [ShareModule],
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css']
})
export class ReviewDetailComponent {
  @Output() onSubmit = new EventEmitter<Review>();

  review!: Review;
  visible = false;

  setForm(review: Review) {
    this.review = review;
  }

  close() {
    this.visible = false;
  }

  submit() {
    this.onSubmit.emit(this.review);
  }
}
