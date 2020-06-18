import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonInfoUpdateComponent } from './person-info-update.component';

const routes: Routes = [
  { path: '', component: PersonInfoUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonInfoUpdateRoutingModule { }
