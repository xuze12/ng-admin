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
      loadChildren: () => import('./pages/roles/roles.module').then(m => m.RolesModule)
    },
    {
      path: 'add',
      loadChildren: () => import('./pages/add-roles/add-roles.module').then(m => m.AddRolesModule)
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
        path: 'infoUpdate/:type',
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
      },
      {
        path: 'infoUpdate/:type',
        loadChildren: () => import('./pages/account/person-info-update/person-info-update.module').then(m => m.PersonInfoUpdateModule)
      },
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
