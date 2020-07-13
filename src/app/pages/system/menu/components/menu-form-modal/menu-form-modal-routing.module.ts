import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuFormModalComponent } from './menu-form-modal.component';

const routes: Routes = [
  { path: '', component: MenuFormModalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuFormModalRoutingModule { }
