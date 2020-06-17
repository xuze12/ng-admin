import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRolesComponent } from './add-roles.component';

const routes: Routes = [
  { path: '', component: AddRolesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRolesRoutingModule { }
