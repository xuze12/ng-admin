import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';

import { PersonComponent } from './person.component';

import {PageHeaderModule} from '../../../components/page-header/page-header.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';


@NgModule({
  imports: [
    CommonModule,
    PersonRoutingModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule
  ],
  declarations: [PersonComponent],
  exports: [PersonComponent]
})
export class PersonModule { }
