/**
 * Created by yuliu on 2017/11/11 0011.
 */
import {Song} from './song';
export class SongList {
  id?: string;    // 列表的网易云 id
  name?: string;   // 列表名字
  cover?: string;   // 列表封面
  creatorName?: string;  // 列表创建者名字
  creatorAvatar?: string;   // 列表创建者头像
  creatorID?: string;
  item?: Song[];
}
