import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AttrFormModalRoutingModule } from './attr-form-modal-routing.module';
import { AttrFormModalComponent } from './attr-form-modal.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AttrFormModalRoutingModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzGridModule
  ],
  declarations: [AttrFormModalComponent],
  exports: [AttrFormModalComponent]
})

export class AttrFormModalModule { }
