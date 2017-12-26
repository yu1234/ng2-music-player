import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './component/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: '',
            component: LoginComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
