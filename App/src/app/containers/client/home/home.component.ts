import { Component, OnInit } from '@angular/core';
import { Gallery } from '../../../core/model/gallery';
import { Product } from '../../../core/model/product';
import { Article } from '../../../core/model/article';
import { Menu } from '../../../core/model/menu';
import { MenuService } from '../../../core/service/menu.service';
import { ArticleService } from '../../../core/service/article.service';
import { GalleryService } from '../../../core/service/gallery.service';
import { ProductService } from '../../../core/service/product.service';
import { ShareModule } from '../../../share.module';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-home',
  imports: [ShareModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mainBanners: Gallery[] = [];
  productSellings: Product[] = [];
  menuHomePages: Menu[] = [];
  highlightArticle: Article[] = [];

  customOptions: OwlOptions = {
    loop: false,
    items: 2,
    margin: 10,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    nav: false
  }

  constructor(
    public menuService: MenuService,
    public articleService: ArticleService,
    public galleryService: GalleryService,
    public productService: ProductService
  ) {
  }

  ngOnInit() {
    this.getBanner();
    this.getProductSelling();
    this.getAllMenuHomePage();
    this.getHighlightArticle();
  }

  getBanner() {
    this.galleryService.get({})
      .subscribe((resp: any) => {
        let datas: Gallery[] = resp;
        this.mainBanners = datas.filter(x => x.type == 1);
      })
  }

  getProductSelling() {
    this.productService.getSelling()
      .subscribe((resp: any) => {
        this.productSellings = resp;
      })
  }

  getAllMenuHomePage() {
    this.menuService.getAllMenuHomePage()
      .subscribe((resp: any) => {
        this.menuHomePages = resp;
      })
  }

  getHighlightArticle() {
    this.articleService.getHighlight()
      .subscribe((resp: any) => {
        this.highlightArticle = resp;
      })
  }
}
