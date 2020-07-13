import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { PersonComponent } from './person.component';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';
import { RegionTreeModule } from '../components/region-tree/region-tree.module';
import { PersonRightContentModule } from '../components/person-right-content/person-right-content.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [
    CommonModule,
    PersonRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    RegionTreeModule,
    PersonRightContentModule,
    NzModalModule,
    NzGridModule
  ],
  declarations: [PersonComponent],
  exports: [PersonComponent],
  providers: [NzNotificationService,NzModalService]
})

export class PersonModule { }
