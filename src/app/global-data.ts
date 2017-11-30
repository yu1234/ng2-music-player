/**
 * Created by yuliu on 2017/11/11 0011.
 */
/*interface httpArgs {
 IP: string;
 PORT: number;
 API: string;
 }*/
import {SongList} from './bean/song-list';
export const AJAX = {
  IP: '172.104.98.7',
  PORT: 80,
  API: 'api.php',
};

export const DefaultArgs = {
  defaultListId: '492641343',
  debug: true
};

/**************************************************
 * MKOnlinePlayer v2.32
 * 播放列表配置模块
 * 编写：mengkun(http://mkblog.cn)
 * 时间：2017-9-15
 *************************************************/
// 建议修改前先备份一下
// 获取 歌曲的网易云音乐ID 或 网易云歌单ID 的方法：
// 先在 js/player.js 中开启调试模式，然后按 F12 打开浏览器的控制台。播放歌曲或点开歌单即可看到相应信息

export const MusicList: SongList[] = [
  // 以下三个系统预留列表请勿更改，否则可能导致程序无法正常运行！
  // 预留列表：搜索结果
  {
    name: '搜索结果',   // 播放列表名字
    cover: '',          // 播放列表封面
    creatorName: '',        // 列表创建者名字
    creatorAvatar: ''      // 列表创建者头像
  },
  // 预留列表：正在播放
  {
    name: '正在播放',   // 播放列表名字
    cover: '',          // 播放列表封面
    creatorName: '',        // 列表创建者名字
    creatorAvatar: ''      // 列表创建者头像
  },
  // 预留列表：播放历史
  {
    name: '播放历史',   // 播放列表名字
    cover: 'assets/images/history.png',          // 播放列表封面
    creatorName: '',        // 列表创建者名字
    creatorAvatar: ''      // 列表创建者头像
  },
  // 以上三个系统预留列表请勿更改，否则可能导致程序无法正常运行！
  // *********************************************
  // 自定义列表开始，您可以自由添加您的自定义列表
  {
    id: '3778678'     // 云音乐热歌榜
  },
  {
    id: '3779629'     // 云音乐新歌榜
  },
  {
    id: '4395559'     // 华语金曲榜
  },
  {
    id: '64016'     // 中国TOP排行榜（内地榜）
  },
  {
    id: '112504'     // 中国TOP排行榜（港台榜）
  },
  {
    id: '19723756'     // 云音乐飙升榜
  },
  {
    id: '2884035'     // '网易原创歌曲榜'
  },
  // 自定义列表教程开始！
  // 方式二：直接提供网易云歌单ID
  {
    id: '492641343'   // 网易云歌单ID
  }   // 播放列表的最后一项大括号后面不要加逗号
];

