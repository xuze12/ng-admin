import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttrFormModalComponent } from './attr-form-modal.component';

const routes: Routes = [
  { path: '', component: AttrFormModalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AttrFormModalRoutingModule { }
