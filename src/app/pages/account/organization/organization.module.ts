import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

// 引用自定义管道
import { OrganizaTypePipe } from '../../../pipe/organiza-type.pipe'

@NgModule({
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    NzInputModule,
    FormsModule,
    NzModalModule,
  ],
  declarations: [OrganizationComponent, OrganizaTypePipe],
  exports: [OrganizationComponent],
  providers: [NzModalService, NzNotificationService]
})
export class OrganizationModule { }
