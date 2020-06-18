import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonInfoUpdateRoutingModule } from './person-info-update-routing.module';

import { PersonInfoUpdateComponent } from './person-info-update.component';

import { PageHeaderModule } from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { RegionTreeModule } from '../../region-tree/region-tree.module';
import { PersonRightContentModule } from '../../person-right-content/person-right-content.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';


@NgModule({
  imports: [
    CommonModule,
    PersonInfoUpdateRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    RegionTreeModule,
    PersonRightContentModule,
    NzGridModule,
    FormsModule,
    NzInputModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    
  ],
  declarations: [PersonInfoUpdateComponent],
  exports: [PersonInfoUpdateComponent]
})
export class PersonInfoUpdateModule { }
