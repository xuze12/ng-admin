import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { DictionaryListRoutingModule } from './dictionary-list-routing.module';
import { DictionaryListComponent } from './dictionary-list.component';
import { PageHeaderModule } from '../../../../components/page-header/page-header.module'
import { AttrFormModalModule } from '../components/attr-form-modal/attr-form-modal.module'

@NgModule({
  imports: [
    CommonModule,
    DictionaryListRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule,
    AttrFormModalModule,
  ],
  declarations: [DictionaryListComponent],
  exports: [DictionaryListComponent],
  providers: [NzNotificationService]
})

export class DictionaryListModule { }
