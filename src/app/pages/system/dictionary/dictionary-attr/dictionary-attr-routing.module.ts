import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DictionaryAttrComponent } from './dictionary-attr.component';

const routes: Routes = [
  { path: '', component: DictionaryAttrComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionaryAttrRoutingModule { }
