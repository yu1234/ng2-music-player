import {Injectable} from '@angular/core';
import {Song} from '../bean/song';
import {PlayData} from '../bean/play-data';
import {AjaxService} from './ajax.service';
import {EventBusService} from './event-bus.service';
import {DefaultArgs} from '../../../global-data';
import {PlayCallback} from '../interface/callback.interface';

declare var layer: any;

@Injectable()
export class AudioServiceService {

  // 主音频标签
  private audio: HTMLAudioElement;
  // 当前列表中的音频
  private _playList: Song[];
  // 当前播放的数据
  private playData: PlayData;
  // 当前歌曲信息
  private currentSong: Song = new Song();

  private _playCallback: PlayCallback;

  // 重复请求次数
  private repeatCount = 0;
  // 播放模式列表
  public modelList = ['order', 'random', 'list', 'single'];
  // 当前播放model
  public model = this.modelList[0];
  // 随机播放数组
  private randomArr = [];

  constructor(private ajaxService: AjaxService, private eventBusService: EventBusService) {
    this.createAudio();
  }


  /**
   * 初始化播放器
   */
  createAudio(): void {
    this.playData = new PlayData();
    this.currentSong = new Song();
    if (!this.audio) {
      this.audio = document.createElement('audio');
      this.audio.autoplay = false;
      this.audio.preload = 'auto';
      // 绑定歌曲进度变化事件
      this.audio.addEventListener('timeupdate', (ev: Event) => this.timeUpdateCallback(this.audio, ev));   // 更新进度
      this.audio.addEventListener('loadedmetadata', (ev: Event) => this.playSuccessCallback(this.audio, ev)); // 可以播放了
      this.audio.addEventListener('play', (ev: Event) => this.playCallback(this.audio, ev));
      this.audio.addEventListener('pause', (ev: Event) => this.pauseCallback(this.audio, ev));   // 暂停
      this.audio.addEventListener('ended', (ev: MediaStreamErrorEvent) => this.endedCallback(this.audio, ev));   // 播放结束
      this.audio.addEventListener('error', (ev: ErrorEvent) => this.playErrorCallback(this.audio, ev));   // 播放器错误处理
    }
  }

  /**
   * 歌曲播放
   * @param song 歌曲对象
   * @param callback 回调函数接口
   * @returns {Promise<Song>}
   */
  play(song: Song, callback?: PlayCallback) {
    // 调试信息输出
    if (DefaultArgs.debug) {
      console.log('歌曲信息：' + JSON.stringify(song));
    }
    this._playCallback = callback;
    this.currentSong = song;
    // 设置当前歌曲索引
    this.setIndex();
    this.ajaxService.getUrlBySongId(song.id, song.source).then(url => {
        if (this.audio) {
          this.audio.pause();
          if (url) {
            this.currentSong.url = url;
            this.audio.src = url;
            this.audio.load();
            this.audio.play();
          } else {
            this.playErrorCallback();
          }
        } else {
          this.playErrorCallback();
        }
      }).catch(() => {
        this.playErrorCallback();
      });


  }

  /**
   * 播放成功回调
   * @param dom
   * @param ev
   * @returns {boolean}
   */
  playSuccessCallback(dom: HTMLElement, ev: Event) {
    if (DefaultArgs.debug) {
      console.log('loadedmetadata');
    }
    this.repeatCount = 0;
    this.currentSong.canPlay = true;
    this.playData.isPlaySuccess = true;
    if (this.audio) {
      this.playData.played = this.audio.played;
      this.playData.paused = this.audio.paused;
      this.playData.src = this.audio.src;
      this.playData.duration = this.audio.duration;
      this.playData.currentTime = this.audio.currentTime;
    }
    if (this.currentSong && this.currentSong.album.picUrl) {
      this.eventBusService.eventBus.emit({
        cover: this.currentSong.album.picUrl
      });
    }
    if (this._playCallback) {
      this._playCallback.playSuccessCallback(this.currentSong);
    }
    // 广播播放时状态信息
    this.eventBusService.playDataEventBus.emit(this.playData);
    // 广播播放成功
    this.eventBusService.playSuccessEventBus.emit(this.playData);
  }

  /**
   * 设置当前歌曲索引
   */
  setIndex() {
    if (this.currentSong) {
      let flag = true;
      if (this._playList) {
        for (let i = 0; i < this._playList.length; i++) {
          if (this.currentSong.id === this._playList[i].id) {
            flag = false;
            this.playData.index = i;
          }
        }
      } else {
        this._playList = [];
      }
      if (flag) {
        this._playList.push(this.currentSong);
        this.playData.index = this._playList.length - 1;
      }

    } else {
      this.playData.index = -1;
    }
  }

  /**
   * 播放失败回调
   * @param dom
   * @param ev
   */
  playErrorCallback(dom?: HTMLElement, ev?: ErrorEvent) {
    if (DefaultArgs.debug) {
      console.log('playErrorCallback:' + JSON.stringify(ev));
    }
    this.repeatCount++;
    // 尝试三次
    if (this.repeatCount < 4) {
      this.resetPlay();
    } else {
      layer.msg('《' + this.currentSong.name + '》' + '播放失败');
      this.playData.isPlaySuccess = false;
      this.currentSong = new Song();
      if (this._playCallback) {
        this._playCallback.playErrorCallback();
      }
      // 广播播放时状态信息
      this.eventBusService.playErrorEventBus.emit(ev);
      this.next();
    }

  }

  /**
   * 暂停
   * @returns {boolean} 返回播放状态,true:正在暂停，false：正在播放
   */
  onPause() {
    if (this.audio) {
      if (!this.audio.paused) {
        this.audio.pause();
      }
    }

  }

  /**
   * 继续播放回调
   */
  pauseCallback(dom: HTMLElement, ev: Event) {
    if (DefaultArgs.debug) {
      console.log('pauseCallback');
    }
    if (this.playData.isPlaySuccess) {
      if (this.audio) {
        this.playData.paused = this.audio.paused;
        this.playData.played = this.audio.played;
      }
      // 广播播放时状态信息
      this.eventBusService.playDataEventBus.emit(this.playData);
    }
  }

  /**
   * 继续播放
   * @returns {boolean} 返回播放状态,true:正在暂停，false：正在播放
   */
  onPlay() {
    if (this.audio) {
      if (this.audio.paused) {
        this.audio.play();
      }
    }
  }

  /**
   * 继续播放回调
   */
  playCallback(dom: HTMLElement, ev: Event) {
    if (DefaultArgs.debug) {
      console.log('playCallback');
    }
    if (this.playData.isPlaySuccess) {
      if (this.audio) {
        this.playData.paused = this.audio.paused;
        this.playData.played = this.audio.played;
      }
      // 广播播放时状态信息
      this.eventBusService.playDataEventBus.emit(this.playData);
    }

  }

  /**
   * 当前播放时间更新
   * @param dom
   * @param ev
   */
  timeUpdateCallback(dom: HTMLElement, ev: Event) {
    if (this.playData.isPlaySuccess) {
      if (this.audio) {
        this.playData.currentTime = this.audio.currentTime;
      }
      // 广播播放时状态信息
      this.eventBusService.playDataEventBus.emit(this.playData);
    }
  }

  /**
   * 播放结束回调
   * @param dom
   * @param ev
   */
  endedCallback(dom: HTMLElement, ev: MediaStreamErrorEvent) {
    if (DefaultArgs.debug) {
      console.log('endedCallback');
    }
    // 广播播放时状态信息
    this.eventBusService.playDataEventBus.emit(this.playData);
    this.next();


  }

  /**
   * 将当前音频跳转到指定百分比进度处
   * @param percent
   */
  public skip(percent: number): void {
    if (this.audio) {
      this.audio.currentTime = this.audio.duration * percent;
      this.playData.currentTime = this.audio.currentTime;
    }

  }

  /**
   * 音量调节
   * @param percent
   */
  volumeAdjustment(percent: number): void {
    if (this.audio) {
      this.audio.volume = percent;
      this.playData.volume = this.audio.volume;
    }
  }

  /**
   * 播放下一首
   */
  next() {
    if (this._playList) {
      if (this.model === this.modelList[1]) {// 随机播放
        if (this.playData.index + 1 > this.randomArr.length - 1) {
          if (this._playList[this.randomArr[0]]) {
            this.play(this._playList[this.randomArr[0]]);
          } else {
            this.play(this._playList[0]);
          }
        } else {
          if (this._playList[this.randomArr[this.playData.index + 1]]) {
            this.play(this._playList[this.randomArr[this.playData.index + 1]]);
          } else {
            this.play(this._playList[0]);
          }
        }
      } else if (this.model === this.modelList[3]) {// 单曲播放
        this.play(this._playList[this.playData.index]);
      } else if (this.model === this.modelList[0]) { // 顺序播放
        if (this.playData.index < this._playList.length - 1) {
          if (this._playList) {
            if (this.playData.index + 1 > this._playList.length - 1) {
              this.play(this._playList[0]);
            } else {
              this.play(this._playList[this.playData.index + 1]);
            }
          }
        } else {
          this.currentSong = new Song();
          this.playData = new PlayData();
          // 广播播放时状态信息
          this.eventBusService.playDataEventBus.emit(this.playData);
          // 广播播放时状态信息
          this.eventBusService.playErrorEventBus.emit();
        }
      } else {// 循环播放
        if (this.playData.index + 1 > this._playList.length - 1) {
          this.play(this._playList[0]);
        } else {
          this.play(this._playList[this.playData.index + 1]);
        }
      }
    }
  }

  /**
   * 播放上一首
   */
  prev() {
    if (this._playList) {
      if (this.model === this.modelList[1]) {// 随机播放
        if (this.playData.index - 1 < 0) {
          if (this._playList[this.randomArr[this.randomArr.length - 1]]) {
            this.play(this._playList[this.randomArr[this.randomArr.length - 1]]);
          } else {
            this.play(this._playList[0]);
          }
        } else {
          if (this._playList[this.randomArr[this.playData.index - 1]]) {
            this.play(this._playList[this.randomArr[this.playData.index - 1]]);
          } else {
            this.play(this._playList[0]);
          }
        }
      } else if (this.model === this.modelList[3]) {// 单曲播放
        this.play(this._playList[this.playData.index]);
      } else {
        if (this.playData.index - 1 < 0) {
          this.play(this._playList[this._playList.length - 1]);
        } else {
          this.play(this._playList[this.playData.index - 1]);
        }
      }

    }
  }

  /**
   *
   * 生成从 1 到 length 之间的随机数组
   *
   * @length 随机数组的长度，如果未传递该参数，那么 length 为默认值 9
   *
   */
  randomArray(length) {
    let i, index, temp, arr = [length];
    length = typeof(length) === 'undefined' ? 9 : length;
    for (i = 0; i < length; i++) {
      arr[i] = i;
    }
    // 打乱数组
    for (i = 0; i < length; i++) {
      // 产生从 i 到 length 之间的随机数
      index = parseInt((Math.random() * (length - i + 1)).toString()) + i;
      if (index !== i) {
        temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
      }
    }
    return arr;
  }

  /**
   *  重新加载播放
   */
  resetPlay() {
    if (this._playList && this._playList[this.playData.index]) {
      this.play(this._playList[this.playData.index]);
    }
  }


  /**
   * 设置播放列表
   */
  set playList(songList: Song[]) {
    if (songList) {
      this._playList = songList;
      this.randomArr = this.randomArray(this._playList.length);
    }
  }

  /**
   * 获取播放列表
   * @returns {Song[]}
   */
  get playList(): Song[] {
    return this._playList;
  }

  get _currentSong(): Song {
    return this.currentSong;
  }

}
