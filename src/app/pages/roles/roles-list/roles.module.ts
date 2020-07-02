import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';

import { RolesComponent } from './roles.component';

import {PageHeaderModule} from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@NgModule({
  imports: [
    CommonModule,
    RolesRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule
  ],
  declarations: [RolesComponent],
  exports: [RolesComponent],
  providers: [NzNotificationService]
})
export class RolesModule { }
