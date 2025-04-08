import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Article} from '../../../core/model/article';
import {Menu} from '../../../core/model/menu';
import {ArticleService} from '../../../core/service/article.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-article',
  imports: [ShareModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  menu!: Menu;
  articleAlias: string = "";
  article!: Article;

  constructor(
    public service: ArticleService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.router.events.forEach((event) => {
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
        this.getArticleRelated();
      })
  }

  getArticleRelated() {
    if (this.article) {
      this.service.getByMenu(this.article.menu.alias, 10)
        .subscribe((resp: any) => {
          this.menu = resp;
        })
    }
  }
}
