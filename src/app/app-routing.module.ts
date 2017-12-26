import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'music',
    loadChildren: 'app/modules/music/music.module#MusicModule'
  },
  {
    path: 'authentication',
    loadChildren: 'app/modules/authentication/authentication.module#AuthenticationModule'
  },
  {path: '', redirectTo: '/music', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
