import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageSelectModalComponent } from './page-select-modal.component';

const routes: Routes = [
  { path: '', component: PageSelectModalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageSelectModalRoutingModule { }
