import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesFormComponent } from './roles-form.component';

const routes: Routes = [
  { path: '', component: RolesFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesFormRoutingModule { }
