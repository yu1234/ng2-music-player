import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {AJAX, DefaultArgs} from '../global-data';
import 'rxjs/add/operator/toPromise';
import {SongList} from '../bean/song-list';
import {Song} from '../bean/song';
import {isUndefined} from "util";

@Injectable()
export class AjaxService {

  songList: SongList;

  constructor(private http: HttpClient) {
  }

  /**
   * 获取歌单列表
   * @param lid 歌单id
   * @returns {Promise<any>}
   */
  getPlayList(lid: string): Promise<SongList> {
    const url = 'http://' + AJAX.IP + ':' + AJAX.PORT + '/' + AJAX.API;
    let jsonData;
    let options;
    options = {
      params: new HttpParams().set('types', 'playlist').set('id', lid)
    };
    return this.http.get(url, options)
      .toPromise()
      .then(response => {
        jsonData = response;
        this.songList = {
          id: lid,    // 列表的网易云 id
          name: jsonData.playlist.name,   // 列表名字
          cover: jsonData.playlist.coverImgUrl,   // 列表封面
          creatorName: jsonData.playlist.creator.nickname,   // 列表创建者名字
          creatorAvatar: jsonData.playlist.creator.avatarUrl,   // 列表创建者头像
          item: []
        };
        if (jsonData.playlist.coverImgUrl !== '') {
          this.songList.cover = jsonData.playlist.coverImgUrl;
        }
        if (jsonData.playlist.tracks !== undefined || jsonData.playlist.tracks.length !== 0) {
          // 存储歌单中的音乐信息
          for (let i = 0; i < jsonData.playlist.tracks.length; i++) {
            this.songList.item[i] = {
              id: jsonData.playlist.tracks[i].id,  // 音乐ID
              name: jsonData.playlist.tracks[i].name,  // 音乐名字
              artist: jsonData.playlist.tracks[i].ar[0].name, // 艺术家名字
              album: jsonData.playlist.tracks[i].al.name,    // 专辑名字
              source: 'netease',     // 音乐来源
              url_id: jsonData.playlist.tracks[i].id,  // 链接ID
              pic_id: null,  // 封面ID
              lyric_id: jsonData.playlist.tracks[i].id,  // 歌词ID
              pic: jsonData.playlist.tracks[i].al.picUrl,    // 专辑图片
              url: null   // mp3链接
            };
          }
        }
        return this.songList;
      })
      .catch(this.handleError);
  }

  /**
   * 获取歌单信息
   */
  getSongListInfo(lid: string): Promise<SongList> {
    const url = 'http://' + AJAX.IP + ':' + AJAX.PORT + '/' + AJAX.API;
    let jsonData;
    let options;
    options = {
      params: new HttpParams().set('types', 'playlist').set('id', lid)
    };
    return this.http.get(url, options)
      .toPromise()
      .then(response => {
        jsonData = response;
        if (!isUndefined(jsonData) && !isUndefined(jsonData.playlist)) {
          this.songList = {
            id: lid,    // 列表的网易云 id
            name: jsonData.playlist.name,   // 列表名字
            cover: jsonData.playlist.coverImgUrl,   // 列表封面
            creatorName: jsonData.playlist.creator.nickname,   // 列表创建者名字
            creatorAvatar: jsonData.playlist.creator.avatarUrl,   // 列表创建者头像
            item: []
          };
        } else {
          this.songList = null;
        }
        return this.songList;
      })
      .catch(this.handleError);
  }

  /**
   * 获取歌曲信息
   * @param id 歌曲ID
   */
  getSongInfo(id: string, source: string): Promise<Song> {

    let song: Song = {};
    // id为空，赋值链接错误。直接回调
    if (!id) {
      song.canPlay = false;
      return Promise.resolve(song);
    } else {
      let url = 'http://' + AJAX.IP + ':' + AJAX.PORT + '/' + AJAX.API;
      let jsonData;
      let options;
      options = {
        params: new HttpParams().set('types', 'url').set('id', id).set('source', source)
      };
      return this.http.get(url, options)
        .toPromise()
        .then(response => {
          jsonData = response;
          console.log('jsonData:' + JSON.stringify(jsonData));
          if (jsonData && jsonData.url) {
            // 调试信息输出
            if (DefaultArgs.debug) {
              console.debug('歌曲信息：' + jsonData);
            }
            song.canPlay = true;
            song.url = jsonData.url;
            song.name = jsonData.name;
            song.pic = jsonData.pic;
          } else {
            song.canPlay = false;
          }
          return song;
        })
        .catch(this.handleError);
    }

  }

  /**
   * 获取歌曲歌词
   * @param 歌词id
   */
  getSongLyric(lyricId: string, source: string): Promise<string> {
    const url = 'http://' + AJAX.IP + ':' + AJAX.PORT + '/' + AJAX.API;
    let options;
    options = {
      params: new HttpParams().set('types', 'lyric').set('id', lyricId).set('source', source)
    };
    return this.http.get(url, options)
      .toPromise().then((jsonData) => {
        if (jsonData && jsonData['lyric']) {
          return jsonData['lyric'];
        } else {
          return '';
        }
      }).catch(this.handleError);
  }


  private handleError(error: HttpErrorResponse): Promise<any> {
    if (DefaultArgs.debug) {
      console.error(error);
    }
    return Promise.reject(error.message || error);
  }
}
