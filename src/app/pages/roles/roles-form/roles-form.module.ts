import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RolesFormRoutingModule } from './roles-form-routing.module';
import { RolesFormComponent } from './roles-form.component';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RolesFormRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
    NzTreeSelectModule,
  ],
  declarations: [RolesFormComponent],
  exports: [RolesFormComponent],
  providers: [NzNotificationService]
})
export class RolesFormModule { }
