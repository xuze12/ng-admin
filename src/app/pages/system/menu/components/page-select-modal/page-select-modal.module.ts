import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { PageSelectModalRoutingModule } from './page-select-modal-routing.module';
import { PageSelectModalComponent } from './page-select-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageSelectModalRoutingModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzGridModule,
    NzRadioModule
  ],
  declarations: [PageSelectModalComponent],
  exports: [PageSelectModalComponent]
})
export class PageSelectModalModule { }
