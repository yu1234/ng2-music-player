import {Song} from './song';

export class SongSheet {
  id?: string;    // 列表的网易云 id
  name?: string;   // 列表名字
  cover?: string;   // 列表封面
  creatorName?: string;  // 列表创建者名字
  creatorAvatar?: string;   // 列表创建者头像
  creatorId?: string;
  date?: number; // 创建时间
  description?: string; // 描述
  type?: number; // 歌单类型
  songs?: Song[];
}
