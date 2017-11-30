import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {MenuComponent} from './component/menu/menu.component';
import {MusicListComponent} from './component/music-list/music-list.component';
import {SongListComponent} from './component/song-list/song-list.component';

import {AjaxService} from './service/ajax.service';
import {AudioServiceService} from './service/audio-service.service';
import {EventBusService} from './service/event-bus.service';
import {PlayerComponent} from './component/player/player.component';
import {ProgressComponent} from './component/progress/progress.component';
import {TimeFormatPipe} from './pipe/time-format.pipe';
import {SongInfoComponent} from './component/song-info/song-info.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MusicListComponent,
    SongListComponent,
    PlayerComponent,
    ProgressComponent,
    TimeFormatPipe,
    SongInfoComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [EventBusService, AjaxService, AudioServiceService],
  bootstrap: [AppComponent],
  entryComponents: [MusicListComponent, SongListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
