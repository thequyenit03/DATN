import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Article} from '../../../core/model/article';
import {ArticleService} from '../../../core/service/article.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-article-ext',
  imports: [ShareModule],
  templateUrl: './article-ext.component.html',
  styleUrls: ['./article-ext.component.css']
})
export class ArticleExtComponent implements OnInit {
  articleAlias: string = "";
  article!: Article;

  constructor(
    public service: ArticleService,
    public activatedRoute: ActivatedRoute,
    router: Router
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.articleAlias = this.activatedRoute.snapshot.params['alias'];
        this.getData();
      }
    }).then();
  }

  ngOnInit() {
    this.articleAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    this.service.getByAlias(this.articleAlias)
      .subscribe((resp: any) => {
        this.article = resp;
      })
  }
}
