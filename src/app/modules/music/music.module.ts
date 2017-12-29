import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
// modules
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {MusicRoutingModule} from './music-routing.module';
// components
import {MusicComponent} from './music.component';
import {MainComponent} from './component/main/main.component';
import {HeadComponent} from './component/head/head.component';

import {SongListComponent} from './component/song-list/song-list.component';
import {MenuComponent} from './component/menu/menu.component';
import {MusicListComponent} from './component/music-list/music-list.component';
/*
import {PlayerComponent} from './component/player/player.component';
import {ProgressComponent} from './component/progress/progress.component';
import {SongInfoComponent} from './component/song-info/song-info.component';
*/
// services
import {AjaxService} from './service/ajax.service';
import {AudioServiceService} from './service/audio-service.service';
import {EventBusService} from './service/event-bus.service';
// pipes
import {TimeFormatPipe} from './pipe/time-format.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule, MusicRoutingModule],
  declarations: [
    MusicComponent,
    TimeFormatPipe,
    MainComponent,
    HeadComponent,
    MenuComponent,
    MusicListComponent,
    SongListComponent
  ],
  exports: [MusicComponent],
  providers: [EventBusService, AjaxService, AudioServiceService]
})
export class MusicModule {
}
