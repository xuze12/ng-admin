import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/roles' },
  {
    path: 'roles',
    component: LayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./pages/roles/roles-list/roles.module').then(m => m.RolesModule)
    },
    {
      path: 'add',
      loadChildren: () => import('./pages/roles/add-roles/add-roles.module').then(m => m.AddRolesModule)
    },
    ]
  },
  {
    path: 'organization',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/account/organization/organization.module').then(m => m.OrganizationModule)
      },
      {
        path: 'orgInfoUpdate',
        loadChildren: () => import('./pages/account/organization-info/organization-info.module').then(m => m.OrganizationInfoModule)
      },
    ]
  },
  {
    path: 'person',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/account/person/person.module').then(m => m.PersonModule)
      }
    ]
  },
  {
    path: 'system',
    component: LayoutComponent,
    children: [
      {
        path: 'menu',
        loadChildren: () => import('./pages/system/menu/menu.module').then(m => m.MenuModule)
      },
      {
        path: 'dictionary-list',
        loadChildren: () => import('./pages/system/dictionary/dictionary-list/dictionary-list.module').then(m => m.DictionaryListModule)
      },
      {
        path: 'dictionary-attr',
        loadChildren: () => import('./pages/system/dictionary/dictionary-attr/dictionary-attr.module').then(m => m.DictionaryAttrModule)
      }
    ]
  },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
