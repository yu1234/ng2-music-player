/**
 * Created by yuliu on 2017/11/12 0012.
 */
export class PlayData {
  isPlaySuccess?: boolean = false;
  currentTime?: number = 0; // 当前播放时间
  src?: string = null; // 播放源
  duration?: number = 0; // 时长
  data?: number = 0; // 缓存流
  paused?: boolean = true; // 是否暂停
  played?: TimeRanges = null;
  index?: number = -1; // 索引
  volume?: number = 0;
}
