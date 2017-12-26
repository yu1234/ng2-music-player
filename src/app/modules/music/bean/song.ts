/**
 * Created by yuliu on 2017/11/11 0011.
 */
import {Artist} from './artist';
import {Lyric} from './lyric';
import {Album} from './album';

export class Song {
  canPlay?: boolean; // 是否可以播放
  id?: string;  // 音乐ID
  name?: string; // 音乐名字
  artists?: Artist[]; // 艺术家名字
  album?: Album;  // 专辑
  source?: string;   // 音乐来源
  lyric?: Lyric; // 歌词
  url?: string; // mp3链接
  date?: number;
}
