import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AJAX, DefaultArgs} from '../../../global-data';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import {SongSheet} from '../bean/song-sheet';
import {Song} from '../bean/song';
import {Lyric} from '../bean/lyric';

@Injectable()
export class AjaxService {


  constructor(private http: HttpClient) {
  }

  /**
   * 根据歌单id获取歌曲
   * @param {string} id
   */
  getSongsBySongSheetId(id: string): Promise<Song[]> {
    const url = `http://${AJAX.IP}:${AJAX.PORT}/music/api/songSheet/songs/${id}`;
    return this.http.get(url).toPromise().then(response => response as Song[]);
  }

  /**
   * 根据type获取歌单
   * @param {number} type
   */
  getSongSheetByType(type: number): Promise<SongSheet[]> {
    const url = `http://${AJAX.IP}:${AJAX.PORT}/music/api/songSheet/type/${type}`;
    return this.http.get(url).toPromise().then(response => response as SongSheet[]);
  }

  /**
   * 获取歌曲url
   * @param id 歌曲ID
   */
  getUrlBySongId(id: string, source: string): Promise<string> {
    // id为空，赋值链接错误。直接回调
    if (!id) {
      return Promise.resolve(null);
    } else {
      const url = `http://${AJAX.IP}:${AJAX.PORT}/music/api/song/url/${id}`;
      return this.http.get(url).toPromise()
        .then(response => response as string)
        .catch(this.handleError);
    }

  }

  /**
   * 获取歌曲歌词
   * @param 歌词id
   */
  getSongLyric(lyricId: string, source: string): Promise<Lyric> {
    const url = `http://${AJAX.IP}:${AJAX.PORT}/music/api/song/lyric/${lyricId}`;
    return this.http.get(url)
      .toPromise().then(response => response as Lyric).catch(this.handleError);
  }


  private handleError(error: HttpErrorResponse): Promise<any> {
    if (DefaultArgs.debug) {
      console.error(error);
    }
    return Promise.reject(error.message || error);
  }
}
