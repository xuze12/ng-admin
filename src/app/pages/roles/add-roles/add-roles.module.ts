import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AddRolesRoutingModule } from './add-roles-routing.module';

import { AddRolesComponent } from './add-roles.component';

import {PageHeaderModule} from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddRolesRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
  ],
  declarations: [AddRolesComponent],
  exports: [AddRolesComponent]
})
export class AddRolesModule { }
