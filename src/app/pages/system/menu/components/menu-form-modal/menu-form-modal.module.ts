import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { MenuFormModalRoutingModule } from './menu-form-modal-routing.module';
import { MenuFormModalComponent } from './menu-form-modal.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuFormModalRoutingModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzGridModule
  ],
  declarations: [MenuFormModalComponent],
  exports: [MenuFormModalComponent]
})
export class MenuFormModalModule { }
