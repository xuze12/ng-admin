import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';

import { PersonComponent } from './person.component';

import { PageHeaderModule } from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { RegionTreeModule } from '../region-tree/region-tree.module';
import { PersonRightContentModule } from '../person-right-content/person-right-content.module'

@NgModule({
  imports: [
    CommonModule,
    PersonRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    RegionTreeModule,
    PersonRightContentModule
  ],
  declarations: [PersonComponent],
  exports: [PersonComponent]
})
export class PersonModule { }
