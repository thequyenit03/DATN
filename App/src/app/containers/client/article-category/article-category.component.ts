import {ViewportScroller} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Menu} from '../../../core/model/menu';
import {ArticleService} from '../../../core/service/article.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-article-category',
  imports: [ShareModule],
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.css']
})
export class ArticleCategoryComponent implements OnInit {
  menu!: Menu;
  nzLoading: boolean = false;

  filter = {
    menuAlias: "",
    take: 10
  }

  constructor(
    public service: ArticleService,
    public activatedRoute: ActivatedRoute,
    public viewportScroller: ViewportScroller,
    public router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
        this.getData();
      }
    }).then();
  }

  ngOnInit() {
    this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    this.service.getByMenu(this.filter.menuAlias, this.filter.take)
      .subscribe((resp: any) => {
        this.menu = resp;
      })
  }

  showMore() {
    let currentLocation: [number, number] = this.viewportScroller.getScrollPosition();
    this.filter.take += 10;
    this.nzLoading = true;
    this.service.getByMenu(this.filter.menuAlias, this.filter.take)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe((resp: any) => {
        this.menu = resp
        setTimeout(() => {
          this.viewportScroller.scrollToPosition(currentLocation)
        }, 10);
      })
  }
}
