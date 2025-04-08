import {ViewportScroller} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {ProductService} from '../../../core/service/product.service';
import {Product} from '../../../core/model/product';
import {ShareModule} from '../../../share.module';

@Component({
  selector: 'app-search',
  imports: [ShareModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  nzLoading: boolean = false;

  filter = {
    keySearch: "",
    orderBy: "highlight",
    price: "all",
    take: 20
  }

  constructor(
    public service: ProductService,
    public viewportScroller: ViewportScroller,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filter.keySearch = this.activatedRoute.snapshot.params['alias'];
        this.filter.take = 20;
        this.getData();
      }
    }).then();
  }

  ngOnInit() {
    this.filter.keySearch = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    this.service.search(this.filter.keySearch, this.filter.orderBy, this.filter.price, this.filter.take)
      .subscribe((resp: any) => {
        this.products = resp;
      })
  }

  showMore() {
    let currentLocation: [number, number] = this.viewportScroller.getScrollPosition();
    this.filter.take += 20;
    this.nzLoading = true;
    this.service.search(this.filter.keySearch, this.filter.orderBy, this.filter.price, this.filter.take)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe((resp: any) => {
        this.products = resp;
        setTimeout(() => {
          this.viewportScroller.scrollToPosition(currentLocation)
        }, 10);
      })
  }
}
