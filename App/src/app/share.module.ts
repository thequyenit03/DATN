import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxCurrencyDirective} from 'ngx-currency';
import {DENgZorroAntdModule} from './ng-zorro-antd.module';
import {RouterLinkWithHref, RouterModule} from "@angular/router";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {NgApexchartsModule} from 'ng-apexcharts';
import {FullPathResourcePipe} from './core/pipe/full-path-resource.pipe';
import {ImageUploadComponent} from './components/image-upload/image-upload.component';
import {OrderTemplateComponent} from './components/order-template/order-template.component';
import {ArticleTemplateComponent} from './components/article-template/article-template.component';
import {
  ArticleTemplateHorizontalComponent
} from './components/article-template-horizontal/article-template-horizontal.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {ProductTemplateComponent} from './components/product-template/product-template.component';
import {OrderStatusPipe} from './core/pipe/order-status.pipe';

@NgModule({
  declarations: [
    ImageUploadComponent,
    OrderTemplateComponent,
    ArticleTemplateComponent,
    ArticleTemplateHorizontalComponent,
    ProductTemplateComponent,
    FullPathResourcePipe,
    OrderStatusPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    DENgZorroAntdModule,
    RouterLinkWithHref,
    NgxCurrencyDirective,
    AngularEditorModule,
    CarouselModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgApexchartsModule,
    DENgZorroAntdModule,
    NgxCurrencyDirective,
    AngularEditorModule,
    FullPathResourcePipe,
    ImageUploadComponent,
    OrderTemplateComponent,
    ArticleTemplateComponent,
    ArticleTemplateHorizontalComponent,
    ProductTemplateComponent,
    OrderStatusPipe,
    CarouselModule
  ],
})
export class ShareModule {
}
