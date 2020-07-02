import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';

import { MenuComponent } from './menu.component';

import {PageHeaderModule} from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {MenuFormModalModule} from './components/menu-form-modal/menu-form-modal.module'
import {PageSelectModalModule} from './components/page-select-modal/page-select-modal.module'
import { NzNotificationService } from 'ng-zorro-antd/notification';


@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule,
    MenuFormModalModule,
    PageSelectModalModule
  ],
  declarations: [MenuComponent],
  exports: [MenuComponent],
  providers: [NzNotificationService]
})
export class MenuModule { }
