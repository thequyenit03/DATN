import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {ArticleComponent} from './article/article.component';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {MasterLayoutComponent} from './layout/master-layout.component';
import {ShareModule} from '../../share.module';
import {ProfileComponent} from './profile/profile.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {CartComponent} from './cart/cart.component';
import {OrderSuccessfulComponent} from './order-successful/order-successful.component';
import {ArticleCategoryComponent} from './article-category/article-category.component';
import {ArticleExtComponent} from './article-ext/article-ext.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {SearchComponent} from './search/search.component';
import {CategoryComponent} from './category/category.component';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from '../../auth/auth-guard.service';


registerLocaleData(en);

const routes: Routes = [
  {
    path: "",
    component: MasterLayoutComponent,
    children: [
      {
        path: "profile",
        canActivate: [AuthGuardService],
        component: ProfileComponent
      },
      {
        path: "dang-nhap",
        component: LoginComponent
      },
      {
        path: "dang-ky-tai-khoan",
        component: SignUpComponent
      },
      {
        path: "dang-xuat",
        component: LogoutComponent
      },
      {
        path: "quen-mat-khau",
        component: ForgotPasswordComponent
      },
      {
        path: "wishlist",
        canActivate: [AuthGuardService],
        component: WishlistComponent
      },
      {
        path: "gio-hang",
        canActivate: [AuthGuardService],
        component: CartComponent
      },
      {
        path: "dat-hang-thanh-cong",
        canActivate: [AuthGuardService],
        component: OrderSuccessfulComponent
      },
      {
        path: "danh-muc-bai-viet/:alias",
        component: ArticleCategoryComponent
      },
      {
        path: "bai-viet/:alias",
        component: ArticleComponent
      },
      {
        path: "thong-tin/:alias",
        component: ArticleExtComponent
      },
      {
        path: "san-pham/:alias",
        component: ProductDetailComponent
      },
      {
        path: "tim-kiem/:alias",
        component: SearchComponent
      },
      {
        path: ":alias",
        component: CategoryComponent
      },
      {
        path: "",
        component: HomeComponent
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ShareModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
  ]
})
export class ClientModule {
}
