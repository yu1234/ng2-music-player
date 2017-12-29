import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';


import {AjaxService} from '../../service/ajax.service';
import {SongSheet} from '../../bean/song-sheet';


@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  songSheets: SongSheet[] = [];
  @Output() onSongListClick = new EventEmitter<string>();
  @Input() type;

  constructor(private ajaxService: AjaxService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.type = params.get('type')).subscribe(() => this.getSongSheetByType(this.type));
  }

  /**
   *根据type获取歌单
   */
  getSongSheetByType(type: number) {
    this.ajaxService.getSongSheetByType(type).then(songSheets => this.renderList(songSheets)).catch(e => this.handleError(e));
  }

  /**
   * 错误处理
   * @param error
   */
  private handleError(error: any): void {

  }

  /**
   * 渲染列表
   */
  private renderList(songSheets: SongSheet[]) {
    if (songSheets && songSheets.length > 0) {
      this.songSheets = songSheets;
      // this.initCustomScrollbar();
    }
  }

  /**
   * 滚动条初始化(只在非移动端启用滚动条控件)
   */
  private initCustomScrollbar() {
    // 滚动条初始化(只在非移动端启用滚动条控件)
   /* $('#sheet').mCustomScrollbar({
      theme: 'minimal',
      advanced: {
        updateOnContentResize: true // 数据更新后自动刷新滚动条
      }
    });*/
  }

  songListClick(id: string) {
    this.onSongListClick.emit(id);
  }
}
