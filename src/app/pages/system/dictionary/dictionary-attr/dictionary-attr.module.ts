import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { DictionaryAttrRoutingModule } from './dictionary-attr-routing.module';

import { DictionaryAttrComponent } from './dictionary-attr.component';

import {PageHeaderModule} from '../../../../components/page-header/page-header.module'
import {AttrFormModalModule} from '../components/attr-form-modal/attr-form-modal.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';


@NgModule({
  imports: [
    CommonModule,
    DictionaryAttrRoutingModule,
    AttrFormModalModule,
    PageHeaderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzModalModule
  ],
  declarations: [DictionaryAttrComponent],
  exports: [DictionaryAttrComponent]
})
export class DictionaryAttrModule { }
