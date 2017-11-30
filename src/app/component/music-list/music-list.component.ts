import {Component, OnInit, AfterContentInit, Input, OnDestroy, ElementRef} from '@angular/core';
import {AjaxService} from '../../service/ajax.service';
import {SongList} from '../../bean/song-list';
import {Song} from '../../bean/song';
import {isUndefined} from "util";
import {AudioServiceService} from '../../service/audio-service.service';
import {EventBusService} from '../../service/event-bus.service';
import {DefaultArgs} from '../../global-data';
import {PlayCallback} from '../../interface/callback.interface';
import {PlayData} from '../../bean/play-data';
declare var $: any;

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.css']
})
export class MusicListComponent implements OnInit, AfterContentInit, PlayCallback, OnDestroy {

  @Input() id: string;
  songListPromise: Promise<SongList>;
  songList: Song[];
  currentPlayingSongId: string;

  private playData: PlayData = new PlayData();
  // 歌单加载状态 1：加载中 2：加载完 3：加载更多 4：清空列表 -1：什么都没有
  private loadStatus: number;

  constructor(private ajaxService: AjaxService, private audioService: AudioServiceService, private eventBusService: EventBusService, private el: ElementRef) {
    this.loadStatus = 1;
  }

  ngOnInit() {
    this.subscribeEvent();
  }

  ngAfterContentInit() {

  }

  /**
   * 加载列表
   * @param id
   */
  loadList(id: string) {
    this.loadStatus = 1;
    if (this.songList) {
      this.songList = [];
    }
    this.songListPromise = this.ajaxService.getPlayList(id);
    this.songListPromise.then(list => {
      if (!isUndefined(list) && list.item.length > 0) {
        this.audioService.playList = list.item;
        this.loadStatus = 0;
        this.songList = list.item;
      } else {
        this.loadStatus = -1;
      }
      this.initCustomScrollbar();
    }).catch((error: any) => this.handleError(error));
  }

  private handleError(error: any): void {
    if (DefaultArgs.debug) {
      console.log('MusicListComponent播放列表请求错误：' + error);
    }
    this.loadStatus = -1;
  }

  /**
   * 滚动条初始化(只在非移动端启用滚动条控件)
   */
  private initCustomScrollbar() {
    $('#main-list').mCustomScrollbar({
      theme: 'minimal',
      advanced: {
        updateOnContentResize: true // 数据更新后自动刷新滚动条
      }
    });
  }

  private playOrPause(song: Song) {
    if (this.currentPlayingSongId === song.id) {
      if (this.playData.paused) {
        if (this.playData.played) {
          this.audioService.onPlay();
        }
      } else {
        this.audioService.onPause();
      }
    } else {
      if (song.id && song.source) {
        this.audioService.play(song, this);
      } else {
        this.playErrorCallback();
      }
    }
  }

  /**
   * 播放出错回调
   */
  playErrorCallback(): any {
    if (DefaultArgs.debug) {
      console.log('播放失败回调：');
    }

  }

  /**
   * 播放成功回调
   */
  playSuccessCallback(song: Song): any {
    if (DefaultArgs.debug) {
      console.log('播放成功回调：');
    }
  }

  /**
   * 订阅广播事件
   */
  subscribeEvent() {
    // 播放开始订阅事件
    this.eventBusService.playSuccessEventBus.subscribe((playData: PlayData) => {
      let song: Song = this.audioService._currentSong;
      if (song) {
       /* let songItem: HTMLElement = this.el.nativeElement.querySelector('#s' + song.id);
        let mainList: HTMLElement = this.el.nativeElement.querySelector('#main-list');
        if(songItem){
          console.log('容器偏移量：'+mainList.offsetTop);
          console.log('偏移量：'+songItem.offsetTop);
        }
       */
        this.currentPlayingSongId = song.id;
      }
    });
    // 播放失败订阅事件
    this.eventBusService.playErrorEventBus.subscribe((ev?: ErrorEvent) => {
      this.currentPlayingSongId = '';
    });
    // 订阅事件
    this.eventBusService.playDataEventBus.subscribe((playData: PlayData) => {
        if (playData) {
          this.playData = playData;
        }
      }
    );
  }

  ngOnDestroy() {
    // this.eventBusService.playDataEventBus.unsubscribe();
  }
}

