import {
  Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ViewContainerRef
} from '@angular/core';
import {MusicListComponent} from '../music-list/music-list.component';
import {SongListComponent} from '../song-list/song-list.component';
import {DefaultArgs} from '../../global-data';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {
  menuItemIndex: number;
  playListId: string = DefaultArgs.defaultListId;


  musicListComponent: MusicListComponent;

  @ViewChild(MusicListComponent) set MusicListComponent(content: MusicListComponent) {
    this.musicListComponent = content;
    if( this.musicListComponent){
      this.musicListComponent.loadList(this.playListId);
    }
  }

  constructor() {
  }

  createComponent(type: number) {
    this.menuItemIndex = type;
    if (this.menuItemIndex === 0) {
      this.createPlayList(this.playListId);
    } else if (this.menuItemIndex === 1) {

    }
  }

  ngOnInit() {
    this.menuItemIndex = 0;
  }

  ngAfterViewInit() {
    this.createPlayList(this.playListId);
  }

  createPlayList(id: string) {
    this.menuItemIndex = 0;
    this.playListId = id;
  }

  onSongListClick(id: string) {
    this.createPlayList(id);
  }

  ngOnDestroy() {

  }

}
