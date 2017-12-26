import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MusicComponent} from './music.component';
import {MainComponent} from './component/main/main.component';
import {MenuComponent} from './component/menu/menu.component';
import {MusicListComponent} from './component/music-list/music-list.component';
import {SongListComponent} from './component/song-list/song-list.component';


const routes: Routes = [
  {
    path: '',
    component: MusicComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            component: MenuComponent,
            children: [
              {
                path: '',
                redirectTo: 'song-list/2',
              },
              {
                path: 'music-list',
                component: MusicListComponent
              },
              {
                path: 'song-list/:type',
                component: SongListComponent
              }
            ]
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
export class MusicRoutingModule {
}
