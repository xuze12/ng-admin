import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { MenuFormModalRoutingModule } from './menu-form-modal-routing.module';
import { MenuFormModalComponent } from './menu-form-modal.component';

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
