import {Component, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {EventBusService} from '../../service/event-bus.service';
import {AjaxService} from '../../service/ajax.service';
import {AudioServiceService} from '../../service/audio-service.service';
import {Song} from '../../bean/song';
import {PlayData} from '../../bean/play-data';
declare var layer: any;
declare var $: any;
@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.css']
})
export class SongInfoComponent implements OnInit, AfterViewInit {
  private cover = 'assets/images/player_cover.png';
  private currentSong: Song;
  private lyric: object;
  private isShow = false;
  private tip = '';
  private lyricArea: HTMLBaseElement;
  private lastLyric: number;
  private playRow = -1;

  constructor(private eventBusService: EventBusService, private ajaxService: AjaxService, private audioService: AudioServiceService, private el: ElementRef) {
  }

  ngOnInit() {
    this.subscribeEvent();
  }

  ngAfterViewInit() {
    this.lyricArea = this.el.nativeElement.querySelector('#lyric');
  }

  subscribeEvent() {
    // 订阅事件
    this.eventBusService.eventBus.subscribe(event => {
        if (event.cover) {
          this.cover = event.cover;
        }
      }
    );
    // 播放开始订阅事件
    this.eventBusService.playSuccessEventBus.subscribe((playData: PlayData) => {
      this.showSongLyric();
    });
    // 播放时订阅事件
    this.eventBusService.playDataEventBus.subscribe((playData: PlayData) => {
        if (playData) {
          this.refreshLyric(playData.currentTime);
        }
      }
    );
  }

  /**
   * 显示歌词
   */
  showSongLyric() {
    this.lyricTip(true, '歌词加载中');
    // 获取当前播放歌曲
    this.currentSong = this.audioService._currentSong;
    // 获取歌词
    if (this.currentSong && this.currentSong.lyric_id && this.currentSong.source) {
      this.ajaxService.getSongLyric(this.currentSong.lyric_id, this.currentSong.source).then((lyric: string) => {
        this.lyricTip(false);
        this.lyricCallback(lyric);
      }).catch(() => {
        this.lyric = null;
        this.lyricTip(true, '歌词读取失败');
      });
    }
  }

  /**
   * 歌曲加载完后的回调函数
   */
  lyricCallback(lyric: string) {
    let _lyric = this.parseLyric(lyric);
    if (!_lyric) {
      this.lyric = null;
      this.lyricTip(true, '没有歌词');
    } else {
      if (this.lyricArea) {
        // 滚动到顶部
        $(this.lyricArea).scrollTop(0);
        this.lastLyric = -1;
        this.lyric = _lyric;
      }
    }
  }

  lyricTip(isShow: boolean, tip?: string) {
    if (tip) {
      this.tip = tip;
    } else {
      this.tip = '';
    }

    this.isShow = isShow;
  }

  /**
   * 解析歌词
   * 这一函数来自 https://github.com/TivonJJ/html5-music-player
   * @param lrc 原始歌词文件
   */
  parseLyric(lrc: string): any {
    if (lrc) {
      let lyrics = lrc.split('\n');
      let lrcObj = {};
      for (let i = 0; i < lyrics.length; i++) {
        let lyric = decodeURIComponent(lyrics[i]);
        let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        let timeRegExpArr = lyric.match(timeReg);
        if (!timeRegExpArr) {
          continue;
        }
        let clause = lyric.replace(timeReg, '');
        for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
          let t = timeRegExpArr[k];
          let min = Number(String(t.match(/\[\d*/i)).slice(1)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1));
          let time = min * 60 + sec;
          lrcObj[time] = clause;
        }
      }
      return lrcObj;
    }
    return null;
  }

  /**
   * 强制刷新当前时间点的歌词
   * @param time 当前播放时间（单位：秒）
   */
  refreshLyric(time: number) {
    if (this.lyric) {
      time = parseInt(time.toString());  // 时间取整
      let i = 0;
      for (let k1 in this.lyric) {
        let k = Number(k1);
        if (k >= time) {
          break;
        }
        i = k;      // 记录上一句的
      }
      this.scrollLyric(i);
    }
  }

  /**
   *  滚动歌词到指定句
   * @param time 当前播放时间（单位：秒）
   */
  scrollLyric(time: number) {
    if (this.lyric) {
      time = parseInt(time.toString());  // 时间取整
      // 当前时间点没有歌词
      if (this.lyric === undefined || this.lyric[time] === undefined) {
        return false;
      }
      // 歌词没发生改变
      if (this.lastLyric === time) {
        return true;
      }

      let i = 0;  // 获取当前歌词是在第几行
      for (let k1 in this.lyric) {
        let k = Number(k1);
        if (k === time) {
          break;
        }
        i++;
      }
      this.lastLyric = time;  // 记录方便下次使用
      this.playRow = i;
      let scroll = ($(this.lyricArea).children().height() * i) - ($('.lyric').height() / 2);
      $(this.lyricArea).stop().animate({scrollTop: scroll}, 1000);  // 平滑滚动到当前歌词位置(更改这个数值可以改变歌词滚动速度，单位：毫秒)
    }
  }


  // 关键就是这个getKeys方法
  getKeys(item) {
    if (item) {
      return Object.keys(item);
    } else {
      return [];
    }
  }
}
