import {Component, OnInit, OnDestroy, AfterViewInit, enableProdMode, HostListener} from '@angular/core';
import {AudioServiceService} from '../../service/audio-service.service';
import {EventBusService} from '../../service/event-bus.service';
import {DefaultArgs} from '../../../../global-data';
import {PlayData} from '../../bean/play-data';
import {Song} from '../../bean/song';

enableProdMode();

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  public paused = true;
  // 音量百分百
  public volumePercent = 0;
  // 进度百分百
  public progressPercent = 0;
  // 进度条锁定
  public progressLocked: boolean;
  // 当前歌曲播放信息
  public playData: PlayData = new PlayData();
  // 是否静音
  public isQuiet = false;
  // 当前播放歌曲
  public currentSong: Song;
  // 当前播放model
  public model = this.audioService.model;

  constructor(private audioService: AudioServiceService, private eventBusService: EventBusService) {
  }

  ngOnInit() {
    this.subscribeEvent();
  }

  ngAfterViewInit() {
    this.initProgress();
  }

  /**
   * 暂停按钮点击事件
   */
  pauseBtnClick() {
    this.audioService.onPause();
  }

  /**
   * 继续播放按钮点击事件
   */
  playBtnClick() {
    if (this.playData && this.playData.index >= 0) {
      this.audioService.onPlay();
    } else {
      let playList = this.audioService.playList;
      if (playList && playList.length > 0 && playList[0]) {
        this.audioService.play(playList[0]);
      }

    }
  }

  /**
   * 下一首按钮点击事件
   */
  nextBtnClick() {
    this.audioService.next();
  }

  /**
   * 上一首按钮点击事件
   */
  prevBtnClick() {
    this.audioService.prev();
  }

  /**
   * 订阅广播事件
   */
  subscribeEvent() {
    // 播放开始订阅事件
    this.eventBusService.playSuccessEventBus.subscribe((playData: PlayData) => {
      if (DefaultArgs.debug) {
        console.log('PlayerComponent.playSuccessEventBus.subscribe');
      }
      this.progressLocked = false;
      this.progressPercent = 0;
      this.currentSong = this.audioService._currentSong;
    });
    // 播放失败订阅事件
    this.eventBusService.playErrorEventBus.subscribe((ev?: ErrorEvent) => {
      if (DefaultArgs.debug) {
        console.log('PlayerComponent.playErrorEventBus.subscribe');
      }
      this.progressLocked = true;
      this.progressPercent = 0;
      this.currentSong = null;
    });
    // 播放时订阅事件
    this.eventBusService.playDataEventBus.subscribe((playData: PlayData) => {
        if (playData) {
          this.playData = playData;
          // 解除锁定
          this.progressLocked = false;
          // 播放进度
          if (playData.currentTime && playData.duration) {
            this.progressPercent = playData.currentTime / playData.duration;
          }

          this.paused = playData.paused;
        }
      }
    );
  }

  /**
   * 音量调节回调
   */
  volumeClassBack(percent: number) {
    if (DefaultArgs.debug) {
      console.log('音量:' + percent);
    }
    this.volumePercent = percent;
    this.audioService.volumeAdjustment(this.volumePercent);
    if (percent > 0) {
      this.isQuiet = false;
    } else {
      this.isQuiet = true;
    }
  }

  /**
   * 进度调节回调
   */
  progressClassBack(percent: number) {
    if (DefaultArgs.debug) {
      console.log('进度:' + percent);
    }

    this.progressPercent = percent;
    this.audioService.skip(percent);

  }

  /**
   * 下面是进度条处理
   */
  initProgress() {
    // 初始化播放进度条
    this.progressLocked = true;
    this.progressPercent = 0;
    // 初始化音量设定
    this.volumePercent = 0.4;
    this.audioService.volumeAdjustment(this.volumePercent);
    this.isQuiet = false;
    // 范围限定
    if (this.volumePercent < 0) {
      this.volumePercent = 0;
    }
    if (this.volumePercent > 1) {
      this.volumePercent = 1;
    }
  }

  /**
   * 切换播放model
   */
  @HostListener('document:keyup.o', ['$event'])
  changeModel() {
    for (let i = 0; i < this.audioService.modelList.length; i++) {
      if (this.audioService.modelList[i] === this.model) {
        if ((i + 1) > this.audioService.modelList.length - 1) {
          this.model = this.audioService.modelList[0];
        } else {
          this.model = this.audioService.modelList[i + 1];
        }
        break;
      }
    }
    this.audioService.model = this.model;
  }

  ngOnDestroy() {
    // this.eventBusService.playDataEventBus.unsubscribe();
  }
}
