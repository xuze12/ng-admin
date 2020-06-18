import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PersonRightContentComponent } from './person-right-content.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzModalModule, NzModalComponent } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [ 
    CommonModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    FormsModule,
    NzInputModule,
    ReactiveFormsModule,
    NzFormModule,
    NzBadgeModule,
    NzModalModule,
    NzGridModule
  ],
  declarations: [PersonRightContentComponent],
  exports: [PersonRightContentComponent],
  providers: [NzModalService]
})
export class PersonRightContentModule { }
