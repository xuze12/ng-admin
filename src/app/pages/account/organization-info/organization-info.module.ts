import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { OrganizationInfoRoutingModule } from './organization-info-routing.module';
import { OrganizationInfoComponent } from './organization-info.component';
import {PageHeaderModule} from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
// import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
// import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';

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
  ],
  declarations: [OrganizationInfoComponent],
  exports: [OrganizationInfoComponent]
})
export class OrganizationInfoModule { }
