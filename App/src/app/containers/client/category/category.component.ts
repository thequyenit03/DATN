import {ViewportScroller} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Menu} from '../../../core/model/menu';
import {ProductService} from '../../../core/service/product.service';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-category',
  imports: [ShareModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  menu!: Menu;
  nzLoading: boolean = false;

  filter = {
    menuAlias: "",
    orderBy: "highlight",
    price: "all",
    take: 20
  }

  constructor(
    public service: ProductService,
    public activatedRoute: ActivatedRoute,
    public viewportScroller: ViewportScroller,
    public router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
        this.filter.take = 20;
        this.getData();
      }
    }).then();
  }

  ngOnInit() {
    this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    this.service.getByMenu(this.filter.menuAlias, this.filter.orderBy, this.filter.price, this.filter.take)
      .subscribe((resp: any) => {
        this.menu = resp;
      })
  }

  showMore() {
    let currentLocation: [number, number] = this.viewportScroller.getScrollPosition();
    this.filter.take += 20;
    this.nzLoading = true;
    this.service.getByMenu(this.filter.menuAlias, this.filter.orderBy, this.filter.price, this.filter.take)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe((resp: any) => {
        this.menu = resp;
        setTimeout(() => {
          this.viewportScroller.scrollToPosition(currentLocation)
        }, 10);
      })
  }
}
