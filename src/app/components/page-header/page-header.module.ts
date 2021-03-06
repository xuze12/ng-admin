import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

// import { RolesRoutingModule } from './roles-routing.module';

import { PageHeaderComponent } from './page-header.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';


@NgModule({
  imports: [
    // RolesRoutingModule,
    CommonModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzDividerModule
  ],
  declarations: [PageHeaderComponent],
  exports: [PageHeaderComponent]
})
export class PageHeaderModule { }
