import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MusicList} from '../../global-data';
import {AjaxService} from '../../service/ajax.service';
import {isUndefined} from "util";
import {SongList} from '../../bean/song-list';
import 'malihu-custom-scrollbar-plugin';
declare var $: any;
@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songListPromise: Promise<SongList>;
  songList: SongList[] = [];
  @Output() onSongListClick = new EventEmitter<string>();

  constructor(private ajaxService: AjaxService) {
  }

  ngOnInit() {
    this.getSongList();
  }

  /**
   * 获取全部歌单
   */
  getSongList() {
    for (let i = 1; i < MusicList.length; i++) {
      if (i === 1) {    // 正在播放列表
        // 读取正在播放列表
        this.songList.push(MusicList[i]);
      } else if (i === 2) { // 历史记录列表
        // 读取历史记录
        this.songList.push(MusicList[i]);
        // 列表不是用户列表，并且信息为空，需要ajax读取列表
      } else if (isUndefined(MusicList[i].creatorID) && (MusicList[i].item === undefined || (i > 2 && MusicList[i].item.length === 0))) {
        if (MusicList[i].id) {   // 列表ID已定义
          // ajax获取列表信息
          this.songListPromise = this.ajaxService.getSongListInfo(MusicList[i].id);
          this.songListPromise.then(list => {
            if (!isUndefined(list)) {
              if (isUndefined(list.cover)) {
                list.cover = 'assets/images/player_cover.png';
              }
              this.songList.push(list);
            }
          }).catch(this.handleError);
        } else {    // 列表 ID 未定义
          if (!MusicList[i].name) {
            MusicList[i].name = '未命名';
            this.songList.push(MusicList[i]);
          }
        }
      }
    }
    this.initCustomScrollbar();
  }

  private handleError(error: any): void {

  }

  /**
   * 滚动条初始化(只在非移动端启用滚动条控件)
   */
  private initCustomScrollbar() {
    // 滚动条初始化(只在非移动端启用滚动条控件)
    $('#sheet').mCustomScrollbar({
      theme: 'minimal',
      advanced: {
        updateOnContentResize: true // 数据更新后自动刷新滚动条
      }
    });
  }

  songListClick(id: string) {
    this.onSongListClick.emit(id);
  }
}
