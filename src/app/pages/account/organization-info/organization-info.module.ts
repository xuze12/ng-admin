import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { OrganizationInfoRoutingModule } from './organization-info-routing.module';
import { OrganizationInfoComponent } from './organization-info.component';
import {PageHeaderModule} from '../../../components/page-header/page-header.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@NgModule({
  imports: [
    CommonModule,
    OrganizationInfoRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzGridModule,
    NzInputModule,
    ReactiveFormsModule,
    // FormsModule,
    NzFormModule,
    NzSelectModule,
    NzTreeSelectModule,
  ],
  providers: [NzNotificationService],
  declarations: [OrganizationInfoComponent],
  exports: [OrganizationInfoComponent]
})
export class OrganizationInfoModule { }
