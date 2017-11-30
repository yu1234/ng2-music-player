import {Injectable, EventEmitter} from '@angular/core';
import {PlayData} from '../bean/play-data';

@Injectable()
export class EventBusService {
  public eventBus: EventEmitter<any> = new EventEmitter<any>();
  // 播放过程广播
  public playDataEventBus: EventEmitter<PlayData> = new EventEmitter<PlayData>();
  // 播放开始广播
  public playSuccessEventBus: EventEmitter<PlayData> = new EventEmitter<PlayData>();
  // 播放失败广播
  public playErrorEventBus: EventEmitter<ErrorEvent> = new EventEmitter<ErrorEvent>();
  constructor() {
  }

}
