import { NgModule } from '@angular/core';

import { RegionTreeComponent } from './region-tree.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms'


@NgModule({
  imports: [
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzTreeModule,
    NzInputModule,
    FormsModule
  ],
  declarations: [RegionTreeComponent],
  exports: [RegionTreeComponent]
})
export class RegionTreeModule { }
