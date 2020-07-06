import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ProhibitComponent } from './pages/result/403/prohibit/prohibit.component';

import { AuthGuard } from './auth-guard.service'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/roles/list' },
  {
    path: 'admin',
    canActivate: [AuthGuard], // 在导航 contacts 之前会先进入路由守卫
    component: LayoutComponent,
    children: [{
      path: 'roles/list',
      loadChildren: () => import('./pages/roles/roles-list/roles.module').then(m => m.RolesModule)
    },
    {
      path: 'roles/infoUpdata/:type',
      loadChildren: () => import('./pages/roles/roles-form/roles-form.module').then(m => m.RolesFormModule)
    },
    {
      path: 'organization/list',
      loadChildren: () => import('./pages/account/organization/organization.module').then(m => m.OrganizationModule)
    },
    {
      path: 'organization/infoUpdate/:type',
      loadChildren: () => import('./pages/account/organization-info/organization-info.module').then(m => m.OrganizationInfoModule)
    },
    {
      path: 'person/list',
      loadChildren: () => import('./pages/account/person/person.module').then(m => m.PersonModule)
    },
    {
      path: 'person/infoUpdate/:type',
      loadChildren: () => import('./pages/account/person-info-update/person-info-update.module').then(m => m.PersonInfoUpdateModule)
    },

    {
      path: 'system/menu/list',
      loadChildren: () => import('./pages/system/menu/menu.module').then(m => m.MenuModule)
    },
    {
      path: 'system/dictionary/list',
      loadChildren: () => import('./pages/system/dictionary/dictionary-list/dictionary-list.module').then(m => m.DictionaryListModule)
    },
    ]
  },
  { path:'admin',   component: LayoutComponent,children:[
    {
      path: '403',
      component: ProhibitComponent
    },
  ]},

  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
