import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProductComponent} from './product/product.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {OrderComponent} from './order/order.component';
import {ArticleComponent} from './article/article.component';
import {EmailTemplateComponent} from './email-template/email-template.component';
import {EmailConfigurationComponent} from './email-configuration/email-configuration.component';
import {UserComponent} from './user/user.component';
import {ReportComponent} from './report/report.component';
import {GalleryComponent} from './gallery/gallery.component';
import {WebsiteComponent} from './website/website.component';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {MasterLayoutComponent} from './layout/master-layout.component';
import {OrderWipComponent} from './order/order-wip/order-wip.component';
import {MenuComponent} from './menu/menu.component';
import {SubMenuComponent} from './sub-menu/sub-menu.component';
import {AttributeComponent} from './attribute/attribute.component';
import {CustomerComponent} from './customer/customer.component';
import {ReportProductComponent} from './report/report-product/report-product.component';
import {ReportRevenueComponent} from './report/report-revenue/report-revenue.component';
import {EmailRegistrationComponent} from './email-registration/email-registration.component';
import {ReviewComponent} from './review/review.component';
import {ProviderComponent} from './provider/provider.component';
import {ShareModule} from '../../share.module';
import { AuthGuardService } from '../../auth/auth-guard.service';


registerLocaleData(en);

const routes: Routes = [
  {
    path: "dang-nhap",
    component: LoginComponent
  },
  {
    path: "dang-xuat",
    component: LogoutComponent
  },
  {
    path: "",
    component: MasterLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "don-hang",
        children: [
          {
            path: "don-hang-can-xu-ly",
            component: OrderWipComponent
          },
          {
            path: "",
            component: OrderComponent
          }
        ]
      },
      {
        path: "menu-chinh",
        component: MenuComponent
      },
      {
        path: "menu-phu",
        component: SubMenuComponent
      },
      {
        path: "website",
        component: WebsiteComponent
      },
      {
        path: "khach-hang",
        component: CustomerComponent
      },
      {
        path: "nha-cung-cap",
        component: ProviderComponent
      },
      {
        path: "email-template",
        component: EmailTemplateComponent
      },
      {
        path: "email-config",
        component: EmailConfigurationComponent
      },
      {
        path: "tai-khoan-quan-tri",
        component: UserComponent
      },
      {
        path: "san-pham",
        component: ProductComponent
      },
      {
        path: "thuoc-tinh-san-pham",
        component: AttributeComponent
      },
      {
        path: "banner",
        component: GalleryComponent
      },
      {
        path: "bai-viet",
        component: ArticleComponent
      },
      {
        path: "thong-ke-don-hang",
        component: ReportComponent
      },
      {
        path: "bao-cao-theo-san-pham",
        component: ReportProductComponent
      },
      {
        path: "bao-cao-doanh-thu",
        component: ReportRevenueComponent
      },
      {
        path: "email-dang-ky-nhan-tin",
        component: EmailRegistrationComponent
      },
      {
        path: "danh-gia",
        component: ReviewComponent
      },
      {
        path: "",
        component: DashboardComponent
      }
    ]
  }
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
export class AdminModule {
}
