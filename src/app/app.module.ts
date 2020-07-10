import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import zh from '@angular/common/locales/zh';

// 第三方组件
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';

// 路由模块
import { AppRoutingModule } from './app-routing.module';

// 组件
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component'
import { SiderComponent } from './components/sider/sider.component'
import { LayoutComponent } from './layout/layout.component'
import { LoginComponent } from './login/login.component';
import {ProhibitComponent} from './pages/result/403/prohibit/prohibit.component';

// 服务
import { MenuService } from './services/menu.service';
import {PowerService} from './services/power.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

// http 请求处理
import { GlobalInterceptor } from './global.interceptor'


registerLocaleData(zh);

@NgModule({

  // 引用组件
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SiderComponent,
    LoginComponent,
    ProhibitComponent
  ],
  // 引用第三方组件
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzGridModule,
    NzBreadCrumbModule,
    // FormsModule,
    NzCheckboxModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzAvatarModule,
    NzDropDownModule,
    NzResultModule,
  ],
  providers: [
    // 防止打包上线页面刷新出现404
    { provide: LocationStrategy, useClass: HashLocationStrategy },

    { provide: NZ_I18N, useValue: zh_CN, },
    // 引用菜单服务
    MenuService,
    PowerService,
    // 引用拦截器
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true
    },
    NzNotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
