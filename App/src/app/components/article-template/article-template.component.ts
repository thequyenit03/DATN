import {Component, Input} from '@angular/core';
import {Article} from '../../core/model/article';

@Component({
  selector: 'app-article-template',
  standalone: false,
  templateUrl: './article-template.component.html',
  styleUrls: ['./article-template.component.css']
})
export class ArticleTemplateComponent {
  @Input() article!: Article;
}
