import {Component, Input} from '@angular/core';
import {Article} from '../../core/model/article';

@Component({
  selector: 'app-article-template-horizontal',
  standalone: false,
  templateUrl: './article-template-horizontal.component.html',
  styleUrls: ['./article-template-horizontal.component.css']
})
export class ArticleTemplateHorizontalComponent {
  @Input() article!: Article;
}
